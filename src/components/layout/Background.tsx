export default function Background() {
  return (
    <>
      {/* Base background */}
      <div className="fixed inset-0 -z-50 bg-[#173E76]" />

      {/* Subtle upper atmospheric glow */}
      <div className="fixed left-1/2 top-[-250px] -z-40 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/5 blur-[180px]" />

      {/* Subtle lower atmospheric glow */}
      <div className="fixed bottom-[-300px] right-[-200px] -z-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-[180px]" />
    </>
  );
}