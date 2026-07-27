"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  function resetModal() {
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

    window.setTimeout(() => {
      resetModal();
    }, 200);
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
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function submit() {
    if (!form.name.trim()) {
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

    startTransition(async () => {
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
          result.staff.accessCode,
        );

        router.refresh();
      } catch (error: any) {
        console.error(
          "CREATE STAFF ERROR:",
          error,
        );

        setError(
          error?.message ??
            "Unable to create staff.",
        );
      }
    });
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        createdCode,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
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
          bg-[#d6a800]
          px-6
          text-sm
          font-bold
          text-black
          transition
          hover:bg-[#e3b400]
          active:scale-[0.98]
        "
      >
        <UserPlus className="h-4 w-4" />

        Add Staff
      </button>

      {/* Modal */}

      <Dialog
        open={open}
        onOpenChange={(
          nextOpen,
        ) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            window.setTimeout(
              resetModal,
              200,
            );
          }
        }}
      >
        <DialogContent
          className="
            max-h-[90vh]
            w-[calc(100%-2rem)]
            overflow-y-auto
            rounded-[28px]
            border
            border-[#2a2a2a]
            bg-[#0b0b0b]
            p-0
            text-white
            shadow-2xl
            sm:max-w-[620px]
          "
        >
          {/* Custom close */}

          <button
            type="button"
            onClick={closeModal}
            className="
              absolute
              right-5
              top-5
              z-20
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-white/60
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {!createdCode ? (
            <>
              {/* Header */}

              <div
                className="
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
                    mb-6
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#d6a800]/30
                    bg-[#d6a800]/10
                  "
                >
                  <UserPlus
                    className="
                      h-5
                      w-5
                      text-[#d6a800]
                    "
                  />
                </div>

                <DialogHeader>
                  <DialogTitle
                    className="
                      text-left
                      text-2xl
                      font-bold
                      tracking-tight
                      text-white
                    "
                  >
                    Add Event Staff
                  </DialogTitle>
                </DialogHeader>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-white/50
                  "
                >
                  Create operational
                  access for a member of
                  your event team.
                </p>
              </div>

              {/* Form */}

              <div
                className="
                  space-y-7
                  px-7
                  py-8
                  sm:px-9
                "
              >
                {/* Identity */}

                <div>
                  <SectionLabel
                    number="01"
                    title="Staff Identity"
                  />

                  <div className="mt-4 space-y-4">
                    <Field
                      label="Full Name"
                      icon={
                        <User className="h-4 w-4" />
                      }
                      required
                    >
                      <input
                        type="text"
                        value={
                          form.name
                        }
                        onChange={(e) =>
                          updateField(
                            "name",
                            e.target
                              .value,
                          )
                        }
                        placeholder="Enter staff member's name"
                        className={inputClass}
                      />
                    </Field>

                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <Field
                        label="Phone"
                        icon={
                          <Phone className="h-4 w-4" />
                        }
                      >
                        <input
                          type="tel"
                          value={
                            form.phone
                          }
                          onChange={(
                            e,
                          ) =>
                            updateField(
                              "phone",
                              e.target
                                .value,
                            )
                          }
                          placeholder="Phone number"
                          className={
                            inputClass
                          }
                        />
                      </Field>

                      <Field
                        label="Email"
                        icon={
                          <Mail className="h-4 w-4" />
                        }
                      >
                        <input
                          type="email"
                          value={
                            form.email
                          }
                          onChange={(
                            e,
                          ) =>
                            updateField(
                              "email",
                              e.target
                                .value,
                            )
                          }
                          placeholder="Email address"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Operations */}

                <div
                  className="
                    border-t
                    border-white/10
                    pt-7
                  "
                >
                  <SectionLabel
                    number="02"
                    title="Event Assignment"
                  />

                  <div className="mt-4 space-y-4">
                    <Field
                      label="Role"
                      icon={
                        <ShieldCheck className="h-4 w-4" />
                      }
                      required
                    >
                      <div className="relative">
                        <select
                          value={
                            form.role
                          }
                          onChange={(
                            e,
                          ) =>
                            updateField(
                              "role",
                              e.target
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
                                  bg-[#111]
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
                    </Field>

                    <Field
                      label="Station"
                      icon={
                        <MapPin className="h-4 w-4" />
                      }
                    >
                      <input
                        type="text"
                        value={
                          form.station
                        }
                        onChange={(e) =>
                          updateField(
                            "station",
                            e.target
                              .value,
                          )
                        }
                        placeholder="e.g. Gate A, Main Stage, VIP Entrance"
                        className={inputClass}
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-5
                          text-white/35
                        "
                      >
                        Optional. Assign
                        where this staff
                        member will
                        primarily operate.
                      </p>
                    </Field>
                  </div>
                </div>

                {/* Error */}

                {error && (
                  <div
                    className="
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

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-white/10
                  bg-white/[0.015]
                  px-7
                  py-6
                  sm:flex-row
                  sm:justify-end
                  sm:px-9
                "
              >
                <button
                  type="button"
                  disabled={pending}
                  onClick={closeModal}
                  className="
                    h-12
                    rounded-full
                    border
                    border-white/10
                    px-6
                    text-sm
                    font-semibold
                    text-white/70
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    pending ||
                    !form.name.trim()
                  }
                  onClick={submit}
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#d6a800]
                    px-7
                    text-sm
                    font-bold
                    text-black
                    transition
                    hover:bg-[#e3b400]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <UserPlus className="h-4 w-4" />

                  {pending
                    ? "Creating..."
                    : "Create Staff"}
                </button>
              </div>
            </>
          ) : (
            /* Success State */

            <div className="px-7 py-10 sm:px-10">
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
                    border-[#d6a800]/30
                    bg-[#d6a800]/10
                  "
                >
                  <Check
                    className="
                      h-7
                      w-7
                      text-[#d6a800]
                    "
                  />
                </div>

                <p
                  className="
                    mt-7
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-[#d6a800]
                  "
                >
                  Staff Created
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-tight
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
                    text-white/50
                  "
                >
                  Give this access code
                  to the staff member.
                  They will use it to
                  access event
                  operations.
                </p>
              </div>

              {/* Code */}

              <div
                className="
                  mt-9
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#d6a800]/25
                  bg-[#d6a800]/[0.06]
                "
              >
                <div
                  className="
                    border-b
                    border-[#d6a800]/15
                    px-6
                    py-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className="
                        h-4
                        w-4
                        text-[#d6a800]
                      "
                    />

                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-white/70
                        "
                      >
                        Staff Access Code
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-white/35
                        "
                      >
                        Keep this code
                        secure
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    px-5
                    py-9
                    text-center
                  "
                >
                  <p
                    className="
                      break-all
                      font-mono
                      text-2xl
                      font-black
                      tracking-[0.22em]
                      text-white
                      sm:text-3xl
                    "
                  >
                    {createdCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-2
                    border-t
                    border-[#d6a800]/15
                    text-sm
                    font-semibold
                    text-white/70
                    transition
                    hover:bg-[#d6a800]/10
                    hover:text-white
                  "
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#d6a800]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy Access Code
                    </>
                  )}
                </button>
              </div>

              {/* Security note */}

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-4
                "
              >
                <div className="flex gap-3">
                  <ShieldCheck
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                      text-[#d6a800]
                    "
                  />

                  <p
                    className="
                      text-xs
                      leading-5
                      text-white/45
                    "
                  >
                    You can regenerate
                    this code or disable
                    the staff member at
                    any time from the
                    staff roster.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeModal();

                  router.refresh();
                }}
                className="
                  mt-8
                  h-13
                  w-full
                  rounded-full
                  bg-[#d6a800]
                  px-6
                  py-4
                  text-sm
                  font-bold
                  text-black
                  transition
                  hover:bg-[#e3b400]
                "
              >
                Done
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Internal UI
|--------------------------------------------------------------------------
*/

const inputClass = `
  h-13
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
  focus:border-[#d6a800]/60
  focus:bg-white/[0.05]
  focus:ring-4
  focus:ring-[#d6a800]/5
`;

function Field({
  label,
  icon,
  required = false,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div
        className="
          mb-2
          flex
          items-center
          gap-2
          text-xs
          font-semibold
          text-white/55
        "
      >
        <span className="text-[#d6a800]">
          {icon}
        </span>

        {label}

        {required && (
          <span className="text-[#d6a800]">
            *
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
          text-[10px]
          font-black
          tracking-[0.2em]
          text-[#d6a800]
        "
      >
        {number}
      </span>

      <h3
        className="
          text-sm
          font-bold
          uppercase
          tracking-[0.12em]
          text-white/80
        "
      >
        {title}
      </h3>

      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}