"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEvent, type FormState } from "@/app/actions/events";
import { CATEGORY_LIST } from "@/lib/categories";

const inputClass =
  "w-full rounded-xl border border-white/12 bg-[#0B0B14] px-4 py-3 text-[color:var(--color-chalk)] outline-none transition placeholder:text-[#6B6B85] focus:border-white/50";
const labelClass = "eyebrow block text-[#6B6B85]";

function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-xs text-[#6B6B85]">{hint}</p> : null}
    </div>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 md:p-8">
      <p className="eyebrow text-[color:var(--color-violet)]">{step}</p>
      <h2 className="display mt-2 text-2xl text-[color:var(--color-chalk)]">{title}</h2>
      {description ? <p className="mt-2 text-sm text-[#9A99B5]">{description}</p> : null}
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[color:var(--color-chalk)] px-6 py-4 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-white disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {pending ? "Submitting..." : "Submit for approval"}
    </button>
  );
}

export function CreateEventForm({
  societies,
  defaultCategory,
  organizerName,
}: {
  societies: { id: string; name: string }[];
  defaultCategory?: string;
  organizerName: string;
}) {
  const [state, action] = useActionState(createEvent, {} as FormState);
  const [category, setCategory] = useState(defaultCategory ?? "music");
  const [registration, setRegistration] = useState(true);

  return (
    <form action={action} className="space-y-6">
      {state.error ? (
        <p className="rounded-xl border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 px-4 py-3 text-sm text-[#FF9E9E]">
          {state.error}
        </p>
      ) : null}

      <Section step="Step 1" title="Basics" description="What is it and who is it for?">
        <Field label="Event title" name="title">
          <input id="title" name="title" required className={inputClass} placeholder="Texture Art Workshop" />
        </Field>
        <Field label="Short subtitle" name="subtitle">
          <input id="subtitle" name="subtitle" className={inputClass} placeholder="Mixed material painting, all levels" />
        </Field>
        <Field label="Description" name="description">
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            className={inputClass}
            placeholder="Tell students what happens, what to expect and why they should come."
          />
        </Field>

        <div>
          <p className={labelClass}>Category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_LIST.map((item) => {
              const selected = category === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className="rounded-full border px-4 py-2 text-sm transition"
                  style={
                    selected
                      ? {
                          borderColor: item.accent,
                          background: `${item.accent}22`,
                          color: item.accent,
                        }
                      : { borderColor: "rgba(255,255,255,0.12)", color: "#C9C7E0" }
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="category" value={category} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tag" name="tag" hint="Shown on the card, e.g. Pottery, Hackathon">
            <input id="tag" name="tag" className={inputClass} />
          </Field>
          <Field label="Cover image URL" name="coverImage">
            <input id="coverImage" name="coverImage" type="url" className={inputClass} placeholder="https://images.unsplash.com/..." />
          </Field>
        </div>
      </Section>

      <Section step="Step 2" title="Schedule and place">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Date" name="date">
            <input id="date" name="date" type="date" required className={inputClass} />
          </Field>
          <Field label="Start time" name="startTime">
            <input id="startTime" name="startTime" type="time" required className={inputClass} />
          </Field>
          <Field label="End time" name="endTime">
            <input id="endTime" name="endTime" type="time" className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Venue" name="venue">
            <input id="venue" name="venue" required className={inputClass} placeholder="University Auditorium" />
          </Field>
          <Field label="Campus location" name="campusLocation">
            <input id="campusLocation" name="campusLocation" className={inputClass} placeholder="Block C, Ground floor" />
          </Field>
        </div>
      </Section>

      {category === "sports" ? (
        <Section
          step="Matchup"
          title="Build the fixture"
          description="Semester vs semester, section vs section, hostel vs hostel — anything goes."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Team A" name="teamA">
              <input id="teamA" name="teamA" className={inputClass} placeholder="Semester 1" />
            </Field>
            <Field label="Team B" name="teamB">
              <input id="teamB" name="teamB" className={inputClass} placeholder="Semester 3" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sport" name="sport">
              <input id="sport" name="sport" className={inputClass} placeholder="Football" />
            </Field>
            <Field label="Match type" name="matchType">
              <select id="matchType" name="matchType" className={inputClass} defaultValue="FRIENDLY">
                <option value="FRIENDLY">Friendly</option>
                <option value="TOURNAMENT">Tournament</option>
                <option value="LEAGUE">League</option>
              </select>
            </Field>
          </div>
        </Section>
      ) : null}

      {category === "trips" ? (
        <Section step="Trip" title="Travel details">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Departure" name="tripDeparture">
              <input id="tripDeparture" name="tripDeparture" className={inputClass} placeholder="6:00 AM" />
            </Field>
            <Field label="Return" name="tripReturn">
              <input id="tripReturn" name="tripReturn" className={inputClass} placeholder="9:00 PM" />
            </Field>
            <Field label="Departure point" name="tripDeparturePoint">
              <input id="tripDeparturePoint" name="tripDeparturePoint" className={inputClass} placeholder="University Main Gate" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Included" name="tripIncluded" hint="Comma separated">
              <input id="tripIncluded" name="tripIncluded" className={inputClass} placeholder="Transport, Guide, Lunch" />
            </Field>
            <Field label="Bring" name="tripBring" hint="Comma separated">
              <input id="tripBring" name="tripBring" className={inputClass} placeholder="Water, Shoes, Jacket" />
            </Field>
          </div>
        </Section>
      ) : null}

      <Section step="Step 3" title="Participation">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Maximum participants" name="capacity" hint="Leave 0 for unlimited">
            <input id="capacity" name="capacity" type="number" min={0} defaultValue={0} className={inputClass} />
          </Field>
          <Field label="Cost (Rs.)" name="cost">
            <input id="cost" name="cost" type="number" min={0} defaultValue={0} className={inputClass} />
          </Field>
          <Field label="Cost note" name="costNote">
            <input id="costNote" name="costNote" className={inputClass} placeholder="Includes transport" />
          </Field>
        </div>
        <Field label="Eligibility" name="eligibility">
          <input id="eligibility" name="eligibility" className={inputClass} placeholder="Open to all students" />
        </Field>
      </Section>

      <Section
        step="Step 4"
        title="Registration"
        description="Collect participant details with your own Google Form. Participant counts are updated by you or an admin."
      >
        <label className="flex items-center gap-3 text-sm text-[color:var(--color-chalk)]">
          <input
            type="checkbox"
            name="registrationRequired"
            checked={registration}
            onChange={(event) => setRegistration(event.target.checked)}
            className="h-4 w-4 accent-[#7C5CFF]"
          />
          Registration required
        </label>
        {registration ? (
          <Field label="Google Form URL" name="googleFormUrl">
            <input
              id="googleFormUrl"
              name="googleFormUrl"
              type="url"
              className={inputClass}
              placeholder="https://forms.gle/..."
            />
          </Field>
        ) : null}
      </Section>

      <Section step="Step 5" title="Organizer">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organizer name" name="organizerName">
            <input
              id="organizerName"
              name="organizerName"
              required
              defaultValue={organizerName}
              className={inputClass}
            />
          </Field>
          <Field label="Society / organization" name="societyId">
            <select id="societyId" name="societyId" className={inputClass} defaultValue="">
              <option value="">No society</option>
              {societies.map((society) => (
                <option key={society.id} value={society.id}>
                  {society.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Contact information" name="contactInfo">
          <input id="contactInfo" name="contactInfo" className={inputClass} placeholder="events@society.edu" />
        </Field>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <Submit />
        <p className="text-sm text-[#6B6B85]">
          Your event goes live once an administrator approves it.
        </p>
      </div>
    </form>
  );
}
