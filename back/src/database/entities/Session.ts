import { ISession } from "connect-typeorm";
import { Entity, Index, Column, PrimaryColumn } from "typeorm";

@Entity()
export class TypeORMSession implements ISession {
    @Index()
    @Column('bigint')
    expiredAt: number;

    @PrimaryColumn('varchar', { length: 255 })
    id: string;

    @Column('text')
    json: string;
}