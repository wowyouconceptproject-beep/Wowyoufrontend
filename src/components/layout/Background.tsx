export default function Background() {
  return (
    <>
      {/* Global EventTech background */}
      <div className="fixed inset-0 -z-50 bg-background" />

      {/* Atmospheric glow */}
      <div
        className="
          fixed
          left-1/2
          top-[-280px]
          -z-40
          h-[720px]
          w-[720px]
          -translate-x-1/2
          rounded-full
          bg-primary/[0.07]
          blur-[180px]
        "
      />

      <div
        className="
          fixed
          bottom-[-300px]
          right-[-220px]
          -z-40
          h-[560px]
          w-[560px]
          rounded-full
          bg-primary-light/[0.045]
          blur-[180px]
        "
      />

      <div
        className="
          fixed
          left-[-240px]
          top-[35%]
          -z-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-primary/[0.035]
          blur-[180px]
        "
      />
    </>
  );
}