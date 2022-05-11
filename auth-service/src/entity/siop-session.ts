import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";

/**
 * User collection
 */
@Entity()
export class SiopSession {
  @ObjectIdColumn()
  id: string;

  @Column()
  state: string;

  @Column()
  nonce: string;

  @Column()
  username: string;

  @CreateDateColumn()
  createdAt: Date;
}
