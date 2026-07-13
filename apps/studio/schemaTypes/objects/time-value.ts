import { defineType } from "sanity";

function allowedTimes() {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      );
    }
  }
  return times;
}

export const timeValue = defineType({
  name: "timeValue",
  title: "Time",
  type: "string",
  options: {
    list: allowedTimes(),
  },
});
