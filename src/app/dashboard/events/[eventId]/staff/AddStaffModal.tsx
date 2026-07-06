"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectItem,
} from "@/components/ui/select";

import {
  createStaff,
} from "@/services/staff";

interface Props {
  eventId: string;
}

export function AddStaffModal({
  eventId,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [pending, startTransition] =
    useTransition();

  const [
    createdCode,
    setCreatedCode,
  ] = useState("");

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      role: "CHECK_IN",
      station: "",
    });

  function submit() {
    startTransition(async () => {
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
          result.staff.accessCode
        );

        router.refresh();

      } catch (error: any) {

        console.error(error);

        alert(
          error.message ??
            "Unable to create staff."
        );

      }
    });
  }

  return (
    <>
      <Button
        onClick={() =>
          setOpen(true)
        }
      >
        + Add Staff
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-lg">

          {!createdCode ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Create Staff
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">

                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone:
                        e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                />

                <Select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role:
                        e.target.value,
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

                <Input
                  placeholder="Station"
                  value={form.station}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      station:
                        e.target.value,
                    })
                  }
                />

              </div>

              <DialogFooter>

                <Button
                  disabled={
                    pending
                  }
                  onClick={
                    submit
                  }
                >
                  {pending
                    ? "Creating..."
                    : "Create Staff"}
                </Button>

              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>

                <DialogTitle>
                  Staff Created
                </DialogTitle>

              </DialogHeader>

              <div className="space-y-4 text-center">

                <p className="text-sm text-gray-500">
                  Give this access code to the
                  staff member. It can be
                  regenerated later.
                </p>

                <div
                  className="
                    rounded-xl
                    border
                    bg-gray-100
                    p-6
                    text-3xl
                    font-black
                    tracking-widest
                  "
                >
                  {createdCode}
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      createdCode
                    )
                  }
                >
                  Copy Access Code
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);

                    setCreatedCode("");

                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      role:
                        "CHECK_IN",
                      station:
                        "",
                    });

                    router.refresh();
                  }}
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