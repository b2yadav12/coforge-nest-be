import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { encryptPassword } from "../../utils";
import { Post } from './post.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  private originalPassword: string;

  @AfterLoad()
  private loadOriginalPassword() {
    this.originalPassword = this.password;
  }

  // Hook to hash the password if it has been modified
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password !== this.originalPassword) {
      this.password = await encryptPassword(this.password);
    }
  }

}