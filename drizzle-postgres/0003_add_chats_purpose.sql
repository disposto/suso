-- Add 'purpose' column to chats table to align with application logic
ALTER TABLE "chats"
ADD COLUMN IF NOT EXISTS "purpose" text NOT NULL DEFAULT 'general';