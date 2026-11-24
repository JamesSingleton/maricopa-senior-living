import { redirect } from "next/navigation";

/** Topics are listed on Find help. */
export default function TopicsIndex() {
  redirect("/resources");
}
