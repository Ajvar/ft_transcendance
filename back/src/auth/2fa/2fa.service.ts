import { Injectable } from "@nestjs/common";
import { User } from "src/database";
import { authenticator } from 'otplib';
import { UsersService } from "src/users/users.service";
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor (
        private readonly usersService: UsersService,
    ) {}

    async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, 'transcendence2fa', secret);

        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return { secret, otpauthUrl }
    }

    async pipeQrCodeStream(stream, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        console.log('verify 2fa')
        console.log(twoFactorAuthenticationCode)
        console.log(user.twoFactorAuthenticationSecret)

        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret
        });
    }
}