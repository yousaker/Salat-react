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

export default function MainContent() {
  const [selectCity, setSelectCity] = useState({
    displayName: "البليدة",
    apiName: "Blida",
  });
  const avilable = [
    {
      displayName: "البليدة",
      apiName: "Blida",
    },
    {
      displayName: "وهران",
      apiName: "Oran",
    },
    {
      displayName: "الجزائر",
      apiName: "َAlger",
    },
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
  const [timings, setTimings] = useState({
    Fajr: "04:57",
    Dhuhr: "12:47",
    Asr: "16:24",
    Sunset: "19:10",
    Isha: "20:34",
  });

  const handleChange = (event) => {
    const cityOpject = avilable.find((city) => {
      return city.apiName == event.target.value;
    });
    setSelectCity(cityOpject);
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={6}>
          <div>
            <h2>سبتمبر 2024 9 </h2>
            <h1>{selectCity.displayName}</h1>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h2> متبقي علي صلاة العصر </h2>
            <h1>00:10:24</h1>
          </div>
        </Grid>
      </Grid>

      <Divider></Divider>
      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          images="/images/24-2-2022_17_07_43_GomhuriaOnline_291645715263.jpg"
        ></Prayer>
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          images="/images/20190919145437611.jpg"
        ></Prayer>
        <Prayer
          name="العصر"
          time={timings.Asr}
          images="/images/20230930125207400.jpg"
        ></Prayer>
        <Prayer
          name="المغرب"
          time={timings.Sunset}
          images="/images/b557020a7fa581d67831b682abbf15cb.jpg"
        ></Prayer>
        <Prayer
          name="العشاء"
          time={timings.Isha}
          images="/images/image147852.jpg"
        ></Prayer>
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
            //  value={age}
            label=""
            onChange={handleChange}
          >
            {avilable.map((city) => {
              return (
                <MenuItem value={city.apiName}>{city.displayName}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
