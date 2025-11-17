export function withSession(
  sessionId: string | null | undefined,
  fn: (sessionId: string) => void
) {
  return () => {
    if (!sessionId) {
      alert("No active session. Please create one first.");
      return;
    }
    fn(sessionId);
  };
}
