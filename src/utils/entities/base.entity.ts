import { Exclude } from 'class-transformer';
import {
    BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
  } from 'typeorm';
  
  export class AppBaseEntity extends BaseEntity {
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;
  
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
  
    @DeleteDateColumn()
    @Exclude()
    public deletedAt: Date;
  }