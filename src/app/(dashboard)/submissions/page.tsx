import { redirect } from "next/navigation";

/** Submissions now live in the Properties page, under the Submissions tab. */
export default function SubmissionsPage() {
  redirect("/properties?tab=submissions");
}
