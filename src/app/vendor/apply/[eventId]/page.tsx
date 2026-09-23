"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";

import {
  getPublicEvent,
  type Event,
} from "@/services/event";

import {
  applyAsVendor,
} from "@/services/vendor";

/*
|--------------------------------------------------------------------------
| Vendor Apply Page
|--------------------------------------------------------------------------
*/

export default function VendorApplyPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | Event
  |--------------------------------------------------------------------------
  */

  const [
    event,
    setEvent,
  ] = useState<Event | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Submission
  |--------------------------------------------------------------------------
  */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    contactName,
    setContactName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    boothSize,
    setBoothSize,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Event
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getPublicEvent(
            params.eventId,
          );

        if (
          !result.success ||
          !result.event
        ) {
          throw new Error(
            result.message ??
              "Unable to load this event.",
          );
        }

        setEvent(
          result.event,
        );
      } catch (err) {
        console.error(
          "VENDOR EVENT LOAD ERROR:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this event.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (
      params.eventId
    ) {
      load();
    }
  }, [
    params.eventId,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Submit Application
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    formEvent: FormEvent<HTMLFormElement>,
  ) {
    formEvent.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    /*
    |--------------------------------------------------------------------------
    | Required Fields
    |--------------------------------------------------------------------------
    */

    if (!businessName.trim()) {
      setError(
        "Business name is required.",
      );

      return;
    }

    if (!category.trim()) {
      setError(
        "Business category is required.",
      );

      return;
    }

    if (!contactName.trim()) {
      setError(
        "Contact name is required.",
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Email address is required.",
      );

      return;
    }

    if (!phone.trim()) {
      setError(
        "Phone number is required.",
      );

      return;
    }

    if (!description.trim()) {
      setError(
        "Please tell the organizer about your business.",
      );

      return;
    }

    if (!password) {
      setError(
        "Please create a password for your vendor account.",
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Email Validation
    |--------------------------------------------------------------------------
    */

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      setError(
        "Please enter a valid email address.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Event Validation
    |--------------------------------------------------------------------------
    */

    if (!event?.id) {
      setError(
        "This event is unavailable.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    try {
      setSubmitting(true);

      const result =
        await applyAsVendor({
          eventId:
            event.id,

          businessName:
            businessName.trim(),

          category:
            category.trim(),

          contactName:
            contactName.trim(),

          email:
            normalizedEmail,

          phone:
            phone.trim(),

          description:
            description.trim(),

          boothSize:
            boothSize.trim() ||
            undefined,

          message:
            message.trim() ||
            undefined,

          password,
        });

      if (
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to submit your vendor application.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Store Vendor Authentication
      |--------------------------------------------------------------------------
      */

      if (result.token) {
        localStorage.setItem(
          "vendorToken",
          result.token,
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Success
      |--------------------------------------------------------------------------
      */

      setSuccess(true);

      /*
      |--------------------------------------------------------------------------
      | Redirect To Vendor Portal
      |--------------------------------------------------------------------------
      */

      window.setTimeout(() => {
        router.push(
          "/vendor/portal/applications",
        );
      }, 1200);
    } catch (err) {
      console.error(
        "VENDOR APPLICATION ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your vendor application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-8">

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            animate-pulse
            gap-8
            py-10
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >

          <div
            className="
              h-[700px]
              rounded-[32px]
              bg-white/[0.04]
            "
          />

          <div
            className="
              h-[850px]
              rounded-[32px]
              border
              border-white/[0.05]
              bg-white/[0.025]
            "
          />

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Event Unavailable
  |--------------------------------------------------------------------------
  */

  if (!event) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          p-6
          text-white
        "
      >
        <div className="max-w-md text-center">

          <Store className="mx-auto h-8 w-8 text-[#3E86A4]" />

          <h1 className="mt-5 text-3xl font-black">
            Event Unavailable
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {error ||
              "This vendor application could not be loaded."}
          </p>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Success State
  |--------------------------------------------------------------------------
  */

  if (success) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          px-6
          text-white
        "
      >

        <div
          className="
            w-full
            max-w-lg
            rounded-[32px]
            border
            border-white/[0.08]
            bg-surface
            px-8
            py-12
            text-center
            md:px-12
          "
        >

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
              border-[#3E86A4]/20
              bg-[#3E86A4]/10
            "
          >
            <CheckCircle2
              className="
                h-8
                w-8
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
              tracking-[0.22em]
              text-[#3E86A4]
            "
          >
            Application Submitted
          </p>

          <h1
            className="
              mt-3
              text-3xl
              font-black
              tracking-tight
            "
          >
            You&apos;re officially in the review process.
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-md
              text-sm
              leading-7
              text-white/40
            "
          >
            Your vendor application for{" "}
            <span className="font-semibold text-white/70">
              {event.title}
            </span>{" "}
            has been sent to the event organizer.
          </p>

          <p
            className="
              mt-7
              text-xs
              text-white/25
            "
          >
            Taking you to your vendor portal...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          md:px-8
          md:py-12
          lg:py-16
        "
      >

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-14
            xl:gap-20
          "
        >

          {/* Event Context */}

          <aside className="lg:sticky lg:top-10 lg:self-start">

            {/* Image */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-white/[0.08]
                bg-surface
              "
            >

              <img
                src={
                  event.coverImage ??
                  "/images/placeholder-event.jpg"
                }
                alt={event.title}
                className="
                  h-[420px]
                  w-full
                  object-cover
                  transition
                  duration-700
                  group-hover:scale-[1.02]
                  md:h-[520px]
                  lg:h-[560px]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/20
                  to-transparent
                "
              />

              {/* Application Label */}

              <div
                className="
                  absolute
                  left-6
                  top-6
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-background/80
                  px-4
                  py-2
                  backdrop-blur-xl
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#3E86A4]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#3E86A4]
                  "
                >
                  Vendor Applications
                </span>

              </div>

              {/* Event Title on Image */}

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">

                {event.category && (
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      text-[#3E86A4]
                    "
                  >
                    {event.category}
                  </p>
                )}

                <h1
                  className="
                    mt-3
                    text-3xl
                    font-black
                    leading-tight
                    tracking-tight
                    md:text-4xl
                  "
                >
                  {event.title}
                </h1>

              </div>

            </div>

            {/* Event Details */}

            <div className="mt-7">

              <div className="flex items-center gap-2">

                <span className="h-px w-7 bg-[#3E86A4]" />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#3E86A4]
                  "
                >
                  About the Event
                </p>

              </div>

              <p
                className="
                  mt-5
                  line-clamp-4
                  text-sm
                  leading-7
                  text-white/45
                  md:text-base
                "
              >
                {event.description}
              </p>

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-1
                  xl:grid-cols-2
                "
              >

                <EventDetail
                  icon={MapPin}
                  label="Venue"
                  value={
                    event.venue
                  }
                />

                <EventDetail
                  icon={CalendarDays}
                  label="Event Date"
                  value={new Date(
                    event.startDate,
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                />

              </div>

            </div>

          </aside>

          {/* Application */}

          <div
            className="
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.08]
              bg-surface
            "
          >

            {/* Form Header */}

            <div
              className="
                border-b
                border-white/[0.07]
                px-6
                py-8
                md:px-10
                md:py-10
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#3E86A4]/15
                  bg-[#3E86A4]/[0.06]
                "
              >
                <Store className="h-5 w-5 text-[#3E86A4]" />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#3E86A4]
                "
              >
                Vendor Marketplace
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-black
                  tracking-tight
                  md:text-4xl
                "
              >
                Become a Vendor
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/40
                "
              >
                Tell the organizer about your business
                and request a vendor space for this event.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-8 md:px-10 md:py-10"
            >

              {/* Error */}

              {error && (
                <div
                  className="
                    mb-8
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/[0.06]
                    px-5
                    py-4
                  "
                >
                  <p className="text-sm leading-6 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {/* Business */}

              <FormSection
                number="01"
                title="Business Information"
                description="Tell us about the business you want to bring to the event."
              >

                <FormField
                  label="Business Name"
                  icon={Building2}
                >
                  <input
                    value={businessName}
                    onChange={(e) =>
                      setBusinessName(
                        e.target.value,
                      )
                    }
                    placeholder="Your business name"
                    className={inputClass}
                    autoComplete="organization"
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Business Category"
                  icon={BriefcaseBusiness}
                >
                  <input
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value,
                      )
                    }
                    placeholder="Fashion, food, technology..."
                    className={inputClass}
                    disabled={submitting}
                  />
                </FormField>

              </FormSection>

              {/* Contact */}

              <FormSection
                number="02"
                title="Contact Information"
                description="Provide the primary contact for this application."
              >

                <FormField
                  label="Contact Name"
                  icon={User}
                >
                  <input
                    value={contactName}
                    onChange={(e) =>
                      setContactName(
                        e.target.value,
                      )
                    }
                    placeholder="Full name"
                    className={inputClass}
                    autoComplete="name"
                    disabled={submitting}
                  />
                </FormField>

                <div className="grid gap-5 md:grid-cols-2">

                  <FormField
                    label="Email Address"
                    icon={Mail}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value,
                        )
                      }
                      placeholder="name@business.com"
                      className={inputClass}
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    icon={Phone}
                  >
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value,
                        )
                      }
                      placeholder="Phone number"
                      className={inputClass}
                      autoComplete="tel"
                      disabled={submitting}
                    />
                  </FormField>

                </div>

              </FormSection>

              {/* Booth */}

              <FormSection
                number="03"
                title="Vendor Requirements"
                description="Help the organizer understand your setup and space requirements."
              >

                <FormField
                  label="About Your Business"
                >
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value,
                      )
                    }
                    placeholder="Tell the organizer about your products, services and what you plan to showcase..."
                    className={`${inputClass} resize-none`}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Preferred Booth Size"
                >
                  <input
                    value={boothSize}
                    onChange={(e) =>
                      setBoothSize(
                        e.target.value,
                      )
                    }
                    placeholder="Example: 3m × 3m"
                    className={inputClass}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Additional Message"
                  optional
                >
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) =>
                      setMessage(
                        e.target.value,
                      )
                    }
                    placeholder="Anything else the organizer should know?"
                    className={`${inputClass} resize-none`}
                    disabled={submitting}
                  />
                </FormField>

              </FormSection>

              {/* Account */}

              <FormSection
                number="04"
                title="Create Your Vendor Account"
                description="Your account gives you access to applications, approvals and event opportunities."
                last
              >

                <div
                  className="
                    rounded-2xl
                    border
                    border-[#3E86A4]/10
                    bg-[#3E86A4]/[0.025]
                    p-5
                  "
                >

                  <div className="flex gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#3E86A4]/[0.12]
                      "
                    >
                      <LockKeyhole className="h-4 w-4 text-[#3E86A4]" />
                    </div>

                    <div>

                      <p className="text-sm font-bold">
                        One Vendor Account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Use your account to track this
                        application and manage future
                        vendor opportunities.
                      </p>

                    </div>

                  </div>

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <FormField
                    label="Password"
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value,
                        )
                      }
                      placeholder="Create password"
                      className={inputClass}
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </FormField>

                  <FormField
                    label="Confirm Password"
                  >
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value,
                        )
                      }
                      placeholder="Confirm password"
                      className={inputClass}
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </FormField>

                </div>

              </FormSection>

              {/* Submit */}

              <div className="mt-10">

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    group
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-[#3E86A4]
                    px-6
                    text-sm
                    font-black
                    text-white
                    transition
                    duration-300
                    hover:bg-[#1F7197]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {submitting ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application

                      <ArrowRight
                        className="
                          h-4
                          w-4
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}

                </button>

                <div
                  className="
                    mt-5
                    flex
                    items-start
                    justify-center
                    gap-2
                    text-center
                  "
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20" />

                  <p className="text-xs leading-5 text-white/25">
                    Your application will be sent directly
                    to the event organizer for review.
                  </p>
                </div>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Event Detail
|--------------------------------------------------------------------------
*/

function EventDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-surface
        p-5
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          bg-white/[0.04]
        "
      >
        <Icon className="h-4 w-4 text-[#3E86A4]" />
      </div>

      <p
        className="
          mt-4
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-white/25
        "
      >
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-white/80">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Form Section
|--------------------------------------------------------------------------
*/

function FormSection({
  number,
  title,
  description,
  children,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      className={`
        ${
          !last
            ? "mb-9 border-b border-white/[0.07] pb-9"
            : ""
        }
      `}
    >

      <div className="mb-6 flex gap-4">

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[#3E86A4]/15
            bg-[#3E86A4]/[0.05]
            text-[10px]
            font-black
            text-[#3E86A4]
          "
        >
          {number}
        </div>

        <div>

          <h3 className="text-base font-bold">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>

        </div>

      </div>

      <div className="space-y-5">
        {children}
      </div>

    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Form Field
|--------------------------------------------------------------------------
*/

function FormField({
  label,
  icon: Icon,
  optional = false,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">

      <div className="mb-2 flex items-center gap-2">

        {Icon && (
          <Icon className="h-3.5 w-3.5 text-white/25" />
        )}

        <span
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-white/35
          "
        >
          {label}
        </span>

        {optional && (
          <span className="text-[10px] text-white/20">
            Optional
          </span>
        )}

      </div>

      {children}

    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Shared Input Style
|--------------------------------------------------------------------------
*/

const inputClass = `
  w-full
  rounded-xl
  border
  border-white/[0.08]
  bg-surface/30
  px-4
  py-4
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/20
  hover:border-white/[0.13]
  focus:border-[#3E86A4]/50
  focus:ring-2
  focus:ring-[#3E86A4]/5
  disabled:cursor-not-allowed
  disabled:opacity-50
`;