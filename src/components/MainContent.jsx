import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useEffect, useState } from "react";
import Prayer from "./Prayer";
import moment from "moment";
import "moment/locale/ar"; // Correct locale import

moment.locale("ar"); // Setting locale to Arabic

export default function MainContent() {
  const [today, setToday] = useState("");
  const [selectCity, setSelectCity] = useState({
    displayName: "البليدة",
    apiName: "Blida",
  });
  const avilable = [
    { displayName: "البليدة", apiName: "Blida" },
    { displayName: "وهران", apiName: "Oran" },
    { displayName: "الجزائر", apiName: "َAlger" },
  ];

  const [timings, setTimings] = useState({
    Fajr: "04:57",
    Dhuhr: "12:47",
    Asr: "16:24",
    Sunset: "19:10",
    Isha: "20:34",
  });
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [remainigTime, setRemainigTime] = useState("");

  const prayerArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=DZ&city=${selectCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [selectCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMMM D YYYY | h:mm:ss A"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    let nextPrayer = prayerArray.find((prayer, index) => {
      const prayerTime = moment(timings[prayer.key], "HH:mm");
      return momentNow.isBefore(prayerTime) || index === 4; // Fallback to Isha if no prayer found
    });

    if (!nextPrayer) nextPrayer = prayerArray[0]; // Fallback to Fajr for next day

    const nextPrayerTime = moment(timings[nextPrayer.key], "HH:mm");
    let remainingTime = nextPrayerTime.diff(momentNow);

    // Handle case where next prayer is after midnight (e.g., Fajr)
    if (remainingTime < 0) {
      remainingTime += 24 * 60 * 60 * 1000; // Add 24 hours to handle next day's Fajr
    }

    const duration = moment.duration(remainingTime);
    setRemainigTime(
      `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`
    );

    setNextPrayerIndex(prayerArray.indexOf(nextPrayer));
  };

  const handleChange = (event) => {
    const cityObject = avilable.find(
      (city) => city.apiName === event.target.value
    );
    setSelectCity(cityObject);
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={6}>
          <div>
            <h2>{today}</h2>
            <h1>{selectCity.displayName}</h1>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h2>متبقي علي صلاة {prayerArray[nextPrayerIndex].displayName}</h2>
            <h1 style={{ direction: "rtl" }}>{remainigTime}</h1>
          </div>
        </Grid>
      </Grid>

      <Divider />

      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          images="/images/24-2-2022_17_07_43_GomhuriaOnline_291645715263.jpg"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          images="/images/20190919145437611.jpg"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          images="/images/20230930125207400.jpg"
        />
        <Prayer
          name="المغرب"
          time={timings.Sunset}
          images="/images/b557020a7fa581d67831b682abbf15cb.jpg"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          images="/images/image147852.jpg"
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "140px" }}>
          <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={handleChange}
          >
            {avilable.map((city) => (
              <MenuItem value={city.apiName} key={city.apiName}>
                {city.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
