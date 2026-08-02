import januaryData from "@/data/history/january.json";
import februaryData from "@/data/history/february.json";
import marchData from "@/data/history/march.json";
import aprilData from "@/data/history/april.json";
import mayData from "@/data/history/may.json";
import juneData from "@/data/history/june.json";
import julyData from "@/data/history/july.json";
import augustData from "@/data/history/august.json";
import septemberData from "@/data/history/september.json";
import octoberData from "@/data/history/october.json";
import novemberData from "@/data/history/november.json";
import decemberData from "@/data/history/december.json";
import todayInHistoryData from "@/data/today_in_history.json";

const monthDataMap = {
  january: januaryData, february: februaryData, march: marchData,
  april: aprilData, may: mayData, june: juneData, july: julyData,
  august: augustData, september: septemberData, october: octoberData,
  november: novemberData, december: decemberData,
};
const emptyHistory = { events: [], birthdays: [], deaths: [] };

function getMarqueeItems(history) {
  return [...(history.events || []), ...(history.birthdays || []), ...(history.deaths || [])]
    .flatMap((item) => (item.marquee_text ? [item.marquee_text] : []));
}

export async function GET() {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(new Date()).reduce((parts, part) => {
    parts[part.type] = part.value;
    return parts;
  }, {});
  const month = dateParts.month.toLowerCase();
  const day = dateParts.day;
  const monthNumber = Object.keys(monthDataMap).indexOf(month) + 1;
  const history = monthDataMap[month]?.[day] || emptyHistory;
  const globalHistory = todayInHistoryData[month]?.[day] || emptyHistory;

  return Response.json({
    date: { iso: `${dateParts.year}-${String(monthNumber).padStart(2, "0")}-${day.padStart(2, "0")}`, month, day },
    history,
    tickerItems: [...getMarqueeItems(history), ...getMarqueeItems(globalHistory)],
  }, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
