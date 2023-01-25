import axios from "axios";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import { channelType } from "../../types/channelType";
import { getSavedItem, saveItem } from "../../utils/storage";
import User from "../User";

type IProps = {
  privateChans: channelType[];
  publicChans: channelType[];
  setPrivateChans: (props: any) => void;
  setPublicChans: (props: any) => void;
  setSelected: (props: any) => void;
};

export default function useChatEvents({
  setPrivateChans,
  setPublicChans,
  setSelected,
}: IProps) {
  const socket = useContext(ChatContext);
  const user = useContext(User);

  // update functions
  const updateSelected = (newChan: channelType) => {
    setSelected((prev: any) => {
      console.log("update selected", newChan);
      console.log("prev", prev);
      if (prev && prev.id === newChan.id) {
        console.log("update selected");
        saveItem("selected", newChan);
        return newChan;
      }
      return prev;
    });
  };

  const updateChannel = (newChan: channelType) => {
    console.log("channel in updateChan", newChan);
    if (newChan.type === "private") {
      setPrivateChans((prev: any) =>
        prev.map((chan: any) => {
          if (chan.id === newChan.id) {
            console.log("updating private");
            return newChan;
          }
          return chan;
        })
      );
    } else {
      console.log("updating public");
      setPublicChans((prev: any) =>
        prev.map((chan: any) => {
          if (chan.id === newChan.id) return newChan;
          return chan;
        })
      );
    }
    updateSelected(newChan);
  };

  // on mount
  useEffect(() => {
    console.log("useeffect");
    const selected = getSavedItem("selected");

    if (selected) {
      socket.emit("joinChannel", { user, channel: selected });
    }

    // get Channels
    axios
      .get("http://localhost:3001/api/chat/privateChannels", {
        withCredentials: true,
      })
      .then((response) => {
        setPrivateChans(response.data);
      });
    axios
      .get("http://localhost:3001/api/chat/publicChannels", {
        withCredentials: true,
      })
      .then((response) => {
        setPublicChans(response.data);
      });

    // events
    socket.on("newChannel", (channel) => {
      console.log("new chan", channel);
      if (channel.type === "private") {
        setPrivateChans((prev: any) => {
          if (prev && !prev.find((chan: channelType) => chan.id === channel.id))
            return [...prev, channel];
          return prev;
        });
      } else {
        setPublicChans((prev: any) => {
          if (prev && !prev.find((chan: channelType) => chan.id === channel.id))
            return [...prev, channel];
          return prev;
        });
      }
    });

    socket.on("joinedChannel", (channel) => {
      console.log("joined channel", channel);
      setSelected(channel);
      saveItem("selected", channel);
      updateChannel(channel);
    });

    socket.on("updateChannel", (channel) => {
      console.log("updating channel");
      updateChannel(channel);
    });

    socket.on("updateSelected", (data) => {
      console.log("updating selected");
      updateSelected(data.channel);
    });

    socket.on("removeChannel", (channel) => {
      console.log("removeChan", channel);
      setPrivateChans((prev: any) =>
        prev.filter((chan: any) => chan.id !== channel.id)
      );
      /*else
        setPublicChans((prev: any) =>
          prev.filter((chan: any) => chan.id !== channel.id)
        );
      setSelected((prev: any) => {
        if (prev && prev.id === channel.id) return null;
        return prev;
      });*/
    });

    socket.on("leftChannel", (channel) => {
      console.log(`client left ${channel.name}`);
      console.log("channel in event", channel);
      updateChannel(channel);
    });

    socket.on("newMessage", (message) => {
      console.log("newmessage", message);

      setSelected((prev: any) => {
        if (prev && prev.id === message.channel.id) {
          const newSelected = {
            ...prev,
            messages: prev.messages.concat(message),
          };
          //saveItem("selected", newSelected);
          return newSelected;
        }
        return prev;
      });
    });

    socket.on("banned", (data) => {
      console.log("ban event");
      alert(
        `You have been banned from ${data.channel.name} until ${data.date}`
      );
      setSelected((prev: any) => {
        if (prev && prev.id === data.channel.id) {
          saveItem("selected", null);
          return null;
        }
      });
      //socket.emit("leaveChannel", { user: data.user, channel: data.channel });
    });

    socket.on("muted", (data) => {
      console.log("mute event");
      alert(
        `You have been muted on channel ${data.channel.name} until ${data.date}`
      );
      setSelected((prev: any) => {
        if (prev && prev.id === data.channel.id) {
          saveItem("selected", data.channel);
          return data.channel;
        }
      });
    });

    socket.on("setAsAdmin", (data) => {
      console.log("set as admin", data);
      updateChannel(data.channel);
    });

    return () => {
      socket.off("newChannel");
      socket.off("joinedChannel");
      socket.off("updateChannel");
      socket.off("updateSelected");
      socket.off("removeChannel");
      socket.off("leftChannel");
      socket.off("newMessage");
      socket.off("banned");
      socket.off("muted");
      socket.off("setAsAdmin");
    };
  }, []);
}
