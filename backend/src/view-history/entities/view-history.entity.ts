import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'view_history' })
export class ViewHistory {
  @PrimaryGeneratedColumn()
  id: number;

  // If userId is text or UUID, choose one and set the type explicitly:
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null; // OK because type:'uuid' is explicit

  @Column({ name: 'session_id', type: 'text' })
  sessionId: string;

  @Column({ name: 'path_json', type: 'jsonb' })
  pathJson: unknown; // keep TS as unknown/object but DB type is explicit

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
