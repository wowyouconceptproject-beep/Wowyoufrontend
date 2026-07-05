import { StaffCard } from "./StaffCard";

interface Staff {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
  station?: string;
  accessCode: string;
  permissions: string[];
  isActive: boolean;
  isRevoked: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

interface Props {
  eventId: string;
  staff: Staff[];
}

export function StaffTable({
  eventId,
  staff,
}: Props) {
  if (staff.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-16 text-center">
        <h2 className="text-xl font-bold">
          No Staff Yet
        </h2>

        <p className="mt-2 text-muted-foreground">
          Create your first event staff member to start
          scanning attendees.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {staff.map((member) => (
        <StaffCard
          key={member.id}
          eventId={eventId}
          staff={member}
        />
      ))}
    </div>
  );
}