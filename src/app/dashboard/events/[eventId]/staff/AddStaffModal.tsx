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
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Select,
  SelectItem,
} from "@/components/ui/select";

import {
  Check,
  Copy,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  createStaff,
} from "@/services/staff";

interface Props {
  eventId: string;
}

export function AddStaffModal({
  eventId,
}: Props) {
  const router =
    useRouter();

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
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    email: "",
    role: "CHECK_IN",
    station: "",
  });

  function resetForm() {
    setCreatedCode("");
    setCopied(false);

    setForm({
      name: "",
      phone: "",
      email: "",
      role: "CHECK_IN",
      station: "",
    });
  }

  function handleOpenChange(
    value: boolean
  ) {
    setOpen(value);

    if (!value) {
      resetForm();
    }
  }

  function submit() {
    if (!form.name.trim()) {
      alert(
        "Staff name is required."
      );

      return;
    }

    startTransition(
      async () => {
        try {
          const result =
            await createStaff(
              eventId,
              {
                ...form,
                permissions: [],
              }
            );

          setCreatedCode(
            result.staff
              .accessCode
          );

          router.refresh();
        } catch (
          error: any
        ) {
          console.error(
            error
          );

          alert(
            error.message ??
              "Unable to create staff."
          );
        }
      }
    );
  }

  async function copyCode() {
    try {
      await navigator
        .clipboard
        .writeText(
          createdCode
        );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1800
      );
    } catch (error) {
      console.error(
        "Unable to copy access code:",
        error
      );
    }
  }

  function done() {
    setOpen(false);

    resetForm();

    router.refresh();
  }

  return (
    <>
      {/* Trigger */}

      <Button
        onClick={() =>
          setOpen(true)
        }
        className="
          h-11
          rounded-xl
          bg-[#D4AF37]
          px-5
          font-bold
          text-black
          transition
          hover:bg-[#E2C158]
        "
      >
        <Plus className="mr-2 h-4 w-4" />

        Add Staff
      </Button>

      {/* Modal */}

      <Dialog
        open={open}
        onOpenChange={
          handleOpenChange
        }
      >
        <DialogContent className="sm:max-w-lg">

          {!createdCode ? (
            <>

              {/* Header */}

              <DialogHeader>

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[#D4AF37]/20
                      bg-[#D4AF37]/10
                    "
                  >
                    <UsersRound className="h-5 w-5 text-[#D4AF37]" />
                  </div>

                  <div>

                    <DialogTitle>
                      Add Event Staff
                    </DialogTitle>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Create a staff profile and assign their operational role for this event.
                    </p>

                  </div>

                </div>

              </DialogHeader>

              {/* Form */}

              <div className="mt-6 space-y-6">

                {/* Identity */}

                <section>

                  <SectionHeading
                    icon={
                      UserRound
                    }
                    title="Staff Identity"
                  />

                  <div className="mt-3 space-y-3">

                    <FieldWrapper
                      label="Full Name"
                      required
                    >
                      <div className="relative">

                        <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          placeholder="Enter staff member's name"
                          value={
                            form.name
                          }
                          onChange={(
                            e
                          ) =>
                            setForm({
                              ...form,
                              name:
                                e
                                  .target
                                  .value,
                            })
                          }
                          className="h-12 pl-10"
                        />

                      </div>
                    </FieldWrapper>

                  </div>

                </section>

                {/* Contact */}

                <section>

                  <SectionHeading
                    icon={Mail}
                    title="Contact Information"
                  />

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <FieldWrapper label="Phone">

                      <div className="relative">

                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          type="tel"
                          placeholder="Phone number"
                          value={
                            form.phone
                          }
                          onChange={(
                            e
                          ) =>
                            setForm({
                              ...form,
                              phone:
                                e
                                  .target
                                  .value,
                            })
                          }
                          className="h-12 pl-10"
                        />

                      </div>

                    </FieldWrapper>

                    <FieldWrapper label="Email">

                      <div className="relative">

                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          type="email"
                          placeholder="Email address"
                          value={
                            form.email
                          }
                          onChange={(
                            e
                          ) =>
                            setForm({
                              ...form,
                              email:
                                e
                                  .target
                                  .value,
                            })
                          }
                          className="h-12 pl-10"
                        />

                      </div>

                    </FieldWrapper>

                  </div>

                </section>

                {/* Assignment */}

                <section>

                  <SectionHeading
                    icon={
                      ShieldCheck
                    }
                    title="Event Assignment"
                  />

                  <div className="mt-3 space-y-3">

                    <FieldWrapper
                      label="Operational Role"
                      required
                    >

                      <Select
                        value={
                          form.role
                        }
                        onChange={(
                          e
                        ) =>
                          setForm({
                            ...form,
                            role:
                              e
                                .target
                                .value,
                          })
                        }
                      >

                        <SelectItem value="CHECK_IN">
                          Check In
                        </SelectItem>

                        <SelectItem value="SECURITY">
                          Security
                        </SelectItem>

                        <SelectItem value="OPERATIONS">
                          Operations
                        </SelectItem>

                        <SelectItem value="STAGE_MANAGER">
                          Stage Manager
                        </SelectItem>

                        <SelectItem value="VENDOR_MANAGER">
                          Vendor Manager
                        </SelectItem>

                      </Select>

                    </FieldWrapper>

                    <FieldWrapper label="Station">

                      <div className="relative">

                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          placeholder="e.g. Main Gate, Hall A, Backstage"
                          value={
                            form.station
                          }
                          onChange={(
                            e
                          ) =>
                            setForm({
                              ...form,
                              station:
                                e
                                  .target
                                  .value,
                            })
                          }
                          className="h-12 pl-10"
                        />

                      </div>

                    </FieldWrapper>

                  </div>

                </section>

                {/* Access explanation */}

                <div
                  className="
                    flex
                    gap-3
                    rounded-2xl
                    border
                    border-[#D4AF37]/15
                    bg-[#D4AF37]/[0.04]
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#D4AF37]/10
                    "
                  >
                    <KeyRound className="h-4 w-4 text-[#D4AF37]" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Staff Access
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      A unique access code will be generated after this staff member is created. They will use it to access their assigned event operations.
                    </p>

                  </div>

                </div>

              </div>

              {/* Footer */}

              <DialogFooter>

                <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <Button
                    variant="outline"
                    disabled={
                      pending
                    }
                    onClick={() =>
                      handleOpenChange(
                        false
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={
                      pending ||
                      !form.name.trim()
                    }
                    onClick={
                      submit
                    }
                    className="
                      bg-[#D4AF37]
                      font-bold
                      text-black
                      hover:bg-[#E2C158]
                    "
                  >

                    {pending ? (
                      <>
                        <span
                          className="
                            mr-2
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-black/30
                            border-t-black
                          "
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />

                        Create Staff
                      </>
                    )}

                  </Button>

                </div>

              </DialogFooter>

            </>
          ) : (
            <>

              {/* Success Header */}

              <DialogHeader>

                <div className="flex flex-col items-center text-center">

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-emerald-500/20
                      bg-emerald-500/10
                    "
                  >
                    <Check className="h-7 w-7 text-emerald-500" />
                  </div>

                  <div className="mt-5">

                    <DialogTitle>
                      Staff Created
                    </DialogTitle>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      The staff profile is ready. Share the access code below with the staff member.
                    </p>

                  </div>

                </div>

              </DialogHeader>

              {/* Credential */}

              <div className="mt-7">

                <div
                  className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/[0.04]
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      border-b
                      border-[#D4AF37]/10
                      px-5
                      py-4
                    "
                  >

                    <KeyRound className="h-4 w-4 text-[#D4AF37]" />

                    <span className="text-sm font-semibold">
                      Staff Access Code
                    </span>

                  </div>

                  <div className="px-5 py-9 text-center">

                    <p
                      className="
                        break-all
                        font-mono
                        text-4xl
                        font-black
                        tracking-[0.22em]
                        sm:text-5xl
                      "
                    >
                      {createdCode}
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground">
                      Keep this credential secure.
                    </p>

                  </div>

                </div>

                {/* Copy */}

                <Button
                  className={`
                    mt-4
                    h-12
                    w-full
                    font-bold
                    ${
                      copied
                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                        : "bg-[#D4AF37] text-black hover:bg-[#E2C158]"
                    }
                  `}
                  onClick={
                    copyCode
                  }
                >

                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />

                      Access Code Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />

                      Copy Access Code
                    </>
                  )}

                </Button>

                {/* Warning */}

                <div className="mt-5 rounded-2xl border bg-muted/20 p-4">

                  <p className="text-xs leading-5 text-muted-foreground">
                    This code grants access to event operations based on the staff member&apos;s assigned role. You can regenerate or disable it later from Staff Management.
                  </p>

                </div>

                <Button
                  variant="outline"
                  className="mt-4 h-12 w-full"
                  onClick={
                    done
                  }
                >
                  Done
                </Button>

              </div>

            </>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <Icon className="h-4 w-4 text-[#D4AF37]" />

      <h3 className="text-sm font-bold">
        {title}
      </h3>

    </div>
  );
}

function FieldWrapper({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-muted-foreground">

        {label}

        {required && (
          <span className="ml-1 text-[#D4AF37]">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}