"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Check,
  ChevronDown,
  Clipboard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import {
  createStaff,
} from "@/services/staff";

interface Props {
  eventId: string;
}

const STAFF_ROLES = [
  {
    value: "CHECK_IN",
    label: "Check In",
  },
  {
    value: "SECURITY",
    label: "Security",
  },
  {
    value: "OPERATIONS",
    label: "Operations",
  },
  {
    value: "STAGE_MANAGER",
    label: "Stage Manager",
  },
  {
    value: "VENDOR_MANAGER",
    label: "Vendor Manager",
  },
];

export function AddStaffModal({
  eventId,
}: Props) {
  const router = useRouter();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    createdCode,
    setCreatedCode,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    email: "",
    role: "CHECK_IN",
    station: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Lock Body Scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  /*
  |--------------------------------------------------------------------------
  | Escape Key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeModal();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  function reset() {
    setCreatedCode("");
    setCopied(false);
    setError("");

    setForm({
      name: "",
      phone: "",
      email: "",
      role: "CHECK_IN",
      station: "",
    });
  }

  function closeModal() {
    setOpen(false);

    window.setTimeout(
      reset,
      150,
    );
  }

  function updateField(
    field:
      | "name"
      | "phone"
      | "email"
      | "role"
      | "station",
    value: string,
  ) {
    setForm(
      (previous) => ({
        ...previous,

        [field]:
          value,
      }),
    );

    if (error) {
      setError("");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Create Staff
  |--------------------------------------------------------------------------
  */

  function submit() {
    if (
      !form.name.trim()
    ) {
      setError(
        "Staff name is required.",
      );

      return;
    }

    if (!form.role) {
      setError(
        "Select a staff role.",
      );

      return;
    }

    setError("");

    startTransition(
      async () => {
        try {
          const result =
            await createStaff(
              eventId,
              {
                name:
                  form.name.trim(),

                phone:
                  form.phone.trim() ||
                  undefined,

                email:
                  form.email.trim() ||
                  undefined,

                role:
                  form.role,

                station:
                  form.station.trim() ||
                  undefined,

                permissions: [],
              },
            );

          if (
            !result?.success ||
            !result?.staff
          ) {
            throw new Error(
              result?.message ??
                "Unable to create staff.",
            );
          }

          setCreatedCode(
            result.staff
              .accessCode,
          );

          router.refresh();
        } catch (
          error: any
        ) {
          console.error(
            "CREATE STAFF ERROR:",
            error,
          );

          setError(
            error?.message ??
              "Unable to create staff.",
          );
        }
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Copy Code
  |--------------------------------------------------------------------------
  */

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        createdCode,
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2000,
      );
    } catch {
      setError(
        "Unable to copy access code.",
      );
    }
  }

  return (
    <>
      {/* Trigger */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          inline-flex
          h-12
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#3E86A4]
          px-6
          text-sm
          font-bold
          text-white
          transition
          duration-200
          hover:bg-[#1F7197]
          active:scale-[0.98]
        "
      >
        <UserPlus
          className="h-4 w-4"
        />

        Add Staff
      </button>

      {/* Native Modal */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            p-4
            sm:p-6
          "
        >
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close modal"
            onClick={
              closeModal
            }
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-black/80
              backdrop-blur-sm
            "
          />

          {/* Modal Panel */}

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-staff-title"
            className="
              relative
              z-10
              flex
              max-h-[90vh]
              w-full
              max-w-[620px]
              flex-col
              overflow-hidden
              rounded-[30px]
              border
              border-white/10
              bg-[#0b0b0b]
              text-white
              shadow-2xl
            "
          >
            {/* Close */}

            <button
              type="button"
              onClick={
                closeModal
              }
              className="
                absolute
                right-6
                top-6
                z-30
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white/50
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <X
                className="
                  h-4
                  w-4
                "
              />
            </button>

            {!createdCode ? (
              <>
                {/* Header */}

                <header
                  className="
                    shrink-0
                    border-b
                    border-white/10
                    px-7
                    pb-7
                    pt-8
                    sm:px-9
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[#3E86A4]/30
                      bg-[#3E86A4]/10
                    "
                  >
                    <UserPlus
                      className="
                        h-5
                        w-5
                        text-[#3E86A4]
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-6
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-[#3E86A4]
                    "
                  >
                    Event Operations
                  </p>

                  <h2
                    id="add-staff-title"
                    className="
                      mt-2
                      text-3xl
                      font-bold
                      tracking-tight
                      text-white
                    "
                  >
                    Add Staff
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-white/45
                    "
                  >
                    Add a member of
                    your operational
                    team and assign
                    their role for
                    this event.
                  </p>
                </header>

                {/* Scrollable Form */}

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    px-7
                    py-8
                    sm:px-9
                  "
                >
                  {/* Identity */}

                  <section>
                    <SectionHeading
                      number="01"
                      title="Staff Identity"
                    />

                    <div className="mt-6 space-y-5">
                      <FieldLabel
                        label="Full Name"
                        icon={
                          <User className="h-4 w-4" />
                        }
                        required
                      />

                      <input
                        type="text"
                        autoFocus
                        value={
                          form.name
                        }
                        onChange={(
                          event,
                        ) =>
                          updateField(
                            "name",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Enter staff member's name"
                        className={
                          inputClass
                        }
                      />

                      <div
                        className="
                          grid
                          gap-5
                          sm:grid-cols-2
                        "
                      >
                        <div>
                          <FieldLabel
                            label="Phone"
                            icon={
                              <Phone className="h-4 w-4" />
                            }
                          />

                          <input
                            type="tel"
                            value={
                              form.phone
                            }
                            onChange={(
                              event,
                            ) =>
                              updateField(
                                "phone",
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="+234..."
                            className={`
                              ${inputClass}
                              mt-2
                            `}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            label="Email"
                            icon={
                              <Mail className="h-4 w-4" />
                            }
                          />

                          <input
                            type="email"
                            value={
                              form.email
                            }
                            onChange={(
                              event,
                            ) =>
                              updateField(
                                "email",
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="staff@example.com"
                            className={`
                              ${inputClass}
                              mt-2
                            `}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Assignment */}

                  <section
                    className="
                      mt-9
                      border-t
                      border-white/10
                      pt-8
                    "
                  >
                    <SectionHeading
                      number="02"
                      title="Event Assignment"
                    />

                    <div className="mt-6 space-y-5">
                      <div>
                        <FieldLabel
                          label="Role"
                          icon={
                            <ShieldCheck className="h-4 w-4" />
                          }
                          required
                        />

                        <div className="relative mt-2">
                          <select
                            value={
                              form.role
                            }
                            onChange={(
                              event,
                            ) =>
                              updateField(
                                "role",
                                event
                                  .target
                                  .value,
                              )
                            }
                            className={`
                              ${inputClass}
                              appearance-none
                              pr-12
                            `}
                          >
                            {STAFF_ROLES.map(
                              (
                                role,
                              ) => (
                                <option
                                  key={
                                    role.value
                                  }
                                  value={
                                    role.value
                                  }
                                  className="
                                    bg-[#111111]
                                    text-white
                                  "
                                >
                                  {
                                    role.label
                                  }
                                </option>
                              ),
                            )}
                          </select>

                          <ChevronDown
                            className="
                              pointer-events-none
                              absolute
                              right-4
                              top-1/2
                              h-4
                              w-4
                              -translate-y-1/2
                              text-white/40
                            "
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel
                          label="Station"
                          icon={
                            <MapPin className="h-4 w-4" />
                          }
                        />

                        <input
                          type="text"
                          value={
                            form.station
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "station",
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Gate A, VIP Entrance, Main Stage..."
                          className={`
                            ${inputClass}
                            mt-2
                          `}
                        />

                        <p
                          className="
                            mt-2
                            text-xs
                            leading-5
                            text-white/30
                          "
                        >
                          Optional.
                          Assign the
                          primary
                          location this
                          person will
                          operate from.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Security */}

                  <div
                    className="
                      mt-8
                      rounded-2xl
                      border
                      border-[#3E86A4]/15
                      bg-[#3E86A4]/[0.04]
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <ShieldCheck
                        className="
                          mt-0.5
                          h-4
                          w-4
                          shrink-0
                          text-[#3E86A4]
                        "
                      />

                      <div>
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white/80
                          "
                        >
                          Staff Access
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-5
                            text-white/35
                          "
                        >
                          A unique
                          access code
                          will be
                          generated
                          after this
                          staff member
                          is created.
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="
                        mt-6
                        rounded-2xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-300
                      "
                    >
                      {error}
                    </div>
                  )}
                </div>

                {/* Footer */}

                <footer
                  className="
                    flex
                    shrink-0
                    flex-col-reverse
                    gap-3
                    border-t
                    border-white/10
                    bg-[#0d0d0d]
                    px-7
                    py-6
                    sm:flex-row
                    sm:justify-end
                    sm:px-9
                  "
                >
                  <button
                    type="button"
                    onClick={
                      closeModal
                    }
                    disabled={
                      pending
                    }
                    className="
                      h-12
                      rounded-full
                      border
                      border-white/10
                      px-6
                      text-sm
                      font-semibold
                      text-white/60
                      transition
                      hover:bg-white/[0.05]
                      hover:text-white
                      disabled:opacity-40
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      submit
                    }
                    disabled={
                      pending ||
                      !form.name.trim()
                    }
                    className="
                      inline-flex
                      h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-[#3E86A4]
                      px-7
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-[#1F7197]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <UserPlus
                      className="
                        h-4
                        w-4
                      "
                    />

                    {pending
                      ? "Creating..."
                      : "Create Staff"}
                  </button>
                </footer>
              </>
            ) : (
              /* Success */

              <div
                className="
                  overflow-y-auto
                  px-7
                  py-10
                  sm:px-10
                "
              >
                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#3E86A4]/30
                      bg-[#3E86A4]/10
                    "
                  >
                    <Check
                      className="
                        h-7
                        w-7
                        text-[#3E86A4]
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-7
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-[#3E86A4]
                    "
                  >
                    Staff Created
                  </p>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-bold
                      text-white
                    "
                  >
                    Access is ready
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-3
                      max-w-sm
                      text-sm
                      leading-6
                      text-white/45
                    "
                  >
                    Give this
                    access code to
                    the staff
                    member. They
                    will use it to
                    access event
                    operations.
                  </p>
                </div>

                <div
                  className="
                    mt-9
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#3E86A4]/25
                    bg-[#3E86A4]/[0.05]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-[#3E86A4]/15
                      px-5
                      py-4
                    "
                  >
                    <ShieldCheck
                      className="
                        h-4
                        w-4
                        text-[#3E86A4]
                      "
                    />

                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-white/70
                        "
                      >
                        Staff Access
                        Code
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-white/30
                        "
                      >
                        Keep this
                        code secure
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      px-5
                      py-10
                      text-center
                    "
                  >
                    <p
                      className="
                        break-all
                        font-mono
                        text-2xl
                        font-black
                        tracking-[0.2em]
                        text-white
                        sm:text-3xl
                      "
                    >
                      {
                        createdCode
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      copyCode
                    }
                    className="
                      flex
                      h-14
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border-t
                      border-[#3E86A4]/15
                      text-sm
                      font-semibold
                      text-white/60
                      transition
                      hover:bg-[#3E86A4]/10
                      hover:text-white
                    "
                  >
                    {copied ? (
                      <>
                        <Check
                          className="
                            h-4
                            w-4
                            text-[#3E86A4]
                          "
                        />

                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard
                          className="
                            h-4
                            w-4
                          "
                        />

                        Copy Access
                        Code
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      px-4
                      py-3
                      text-sm
                      text-red-300
                    "
                  >
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    router.refresh();
                  }}
                  className="
                    mt-8
                    h-12
                    w-full
                    rounded-full
                    bg-[#3E86A4]
                    px-6
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-[#1F7197]
                  "
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const inputClass = `
  w-full
  rounded-2xl
  border
  border-white/10
  bg-white/[0.035]
  px-4
  py-3.5
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/25
  hover:border-white/20
  focus:border-[#3E86A4]/60
  focus:bg-white/[0.05]
  focus:ring-4
  focus:ring-[#3E86A4]/5
`;

function FieldLabel({
  label,
  icon,
  required = false,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-xs
        font-semibold
        text-white/55
      "
    >
      <span
        className="
          text-[#3E86A4]
        "
      >
        {icon}
      </span>

      <span>
        {label}
      </span>

      {required && (
        <span
          className="
            text-[#3E86A4]
          "
        >
          *
        </span>
      )}
    </div>
  );
}

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      <span
        className="
          text-[10px]
          font-black
          tracking-[0.2em]
          text-[#3E86A4]
        "
      >
        {number}
      </span>

      <h3
        className="
          text-xs
          font-bold
          uppercase
          tracking-[0.15em]
          text-white/70
        "
      >
        {title}
      </h3>

      <div
        className="
          h-px
          flex-1
          bg-white/10
        "
      />
    </div>
  );
}