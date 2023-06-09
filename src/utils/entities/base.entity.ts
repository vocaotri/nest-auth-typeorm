import { Exclude } from 'class-transformer';
import {
    BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
  } from 'typeorm';
  
  export class AppBaseEntity extends BaseEntity {
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;
  
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
  
    @DeleteDateColumn()
    @Exclude()
    public deletedAt: Date;
  }