-- Mobile Credits Table
-- Separate credit system for mobile app development (iOS/Android)

-- Create mobile_credits table
CREATE TABLE IF NOT EXISTS mobile_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mobile_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own mobile credits" ON mobile_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mobile credits" ON mobile_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mobile credits" ON mobile_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to safely adjust mobile credits
CREATE OR REPLACE FUNCTION adjust_mobile_credits(delta INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Insert or update mobile credits for the current user
  INSERT INTO mobile_credits (user_id, balance, updated_at)
  VALUES (auth.uid(), GREATEST(0, delta), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance = GREATEST(0, mobile_credits.balance + delta),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION adjust_mobile_credits(INTEGER) TO authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_mobile_credits_user_id ON mobile_credits(user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mobile_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mobile_credits_updated_at
  BEFORE UPDATE ON mobile_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_mobile_credits_updated_at();