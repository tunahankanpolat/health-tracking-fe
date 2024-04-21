import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import { View, Modal, Text, TouchableOpacity, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

{
  Platform.OS === "web" &&
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
}

export default function CustomLineChart(props) {
  const { healthData,thema } = props;
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [lastLabel, setLastLabel] = useState("");
  const [firstLabel, setFirstLabel] = useState("");
  const inverseThema = thema === "background" ? "primary" : "background";
  const inverseThemaCode = thema === "background" ? "#333333" : "#f0f0f0";
  const themaCode = thema === "background" ? "#f0f0f0" : "#333333";
  useEffect(() => {
    if (healthData.length !== 0) {
      setFirstLabel(
        new Date(healthData[0].time_stamp).toLocaleDateString("tr-TR")
      );
      setLastLabel(
        new Date(
          healthData[healthData.length - 1].time_stamp
        ).toLocaleDateString("tr-TR")
      );
    }
  }, [healthData]);

  const filterData = () => {
    const now = Date.now();
    switch (timeFilter) {
      case "1 Day":
        return healthData.filter((d) => now - d.time_stamp <= 86400000);
      case "1 Month":
        return healthData.filter((d) => now - d.time_stamp <= 2629800000);
      case "1 Year":
        return healthData.filter((d) => now - d.time_stamp <= 31557600000);
      default:
        return healthData;
    }
  };

  // A helper function to selectively display labels to avoid overlap
  const getLabels = (data) => {
    return data.map((d, index) => {
      return "";
    });
  };

  const filteredData = filterData();
  const chartData = {
    labels: getLabels(filteredData),
    datasets: [
      {
        data: filteredData.map((d) => d.health_data.heart_rate),
      },
    ],
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Heart Rate",
        data: chartData.datasets[0].data,
        fill: false,
        backgroundColor: "rgba(255, 165, 0, 0.5)", // Example background color
        borderColor: "rgba(255, 165, 0, 1)", // Example border color
        pointBorderColor: "rgba(255, 165, 0, 1)", // Example dot border color
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 2,
        tension: 0.4, // This makes the line bezier/curved
      },
    ],
  };
  const options = {
    scales: {
      y: {
        type: "linear", // This is the default type and can actually be omitted.
        beginAtZero: false,
        ticks: {
          color: inverseThema, // Color for the y-axis tick labels.
        },
      },
      x: {
        type: "category",
        ticks: {
          color: inverseThema, // Color for the x-axis tick labels.
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: inverseThema, // Color for the legend labels.
        },
      },
    },
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4, // Bezier curve tension (formerly known as 'lineTension' in Chart.js 2.x)
      },
      point: {
        radius: 2, // Radius of points (formerly known as 'pointRadius')
        borderWidth: 2, // Border width of points (formerly known as 'pointBorderWidth')
        backgroundColor: "rgba(255, 165, 0, 0.5)", // Background color of points (formerly known as 'pointBackgroundColor')
        borderColor: "rgba(255, 165, 0, 1)", // Border color of points (formerly known as 'pointBorderColor')
      },
    },
    borderRadius: 16,
  };
  const screenWidth = Dimensions.get("window").width;
  const defaultChartData = {
    labels: [
      "0.1",
      "0.2",
      "0.3",
      "0.4",
      "0.5",
      "0.6",
      "0.7",
      "0.8",
      "0.9",
      "1.0",
    ],
    datasets: [
      {
        data: ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      },
    ],
  };
  if (Platform.OS === "web") {
    return (
      <View className={`flex-1 justify-center items-center bg-${thema} w-full h-full`}>
        <Line data={data} options={options} height={220} />
        {healthData.length != 0 && (
          <View className="flex-row justify-between w-full -translate-y-5">
            <Text className="text-[#ffa726] text-xs">{firstLabel}</Text>
            <Text className="text-[#ffa726] text-xs">{lastLabel}</Text>
          </View>
        )}

        <View className="flex-row justify-around">
          {["All Time", "1 Year", "1 Month", "1 Day"].map((period) => (
            <Pressable
              key={period}
              onPress={() => setTimeFilter(period)}
              className="p-2"
            >
              <Text
                className={`text-lg ${
                  timeFilter === period ? "text-[#ffa726]" : `text-${inverseThema}`
                }`}
              >
                {period}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  } else {
    return (
      <View className={`flex-1 justify-center items-center bg-${thema} w-full h-full`}>
        <LineChart
        withInnerLines={false}
          data={chartData ? chartData : defaultChartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: themaCode,
            backgroundGradientFrom: themaCode,
            backgroundGradientTo: themaCode,
            decimalPlaces: 0,
            color: (opacity = 1) => "#ffa726",
            labelColor: (opacity = 1) => inverseThemaCode,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "0.1",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            borderRadius: 16,
            marginEnd: 40,
            labelColor: inverseThemaCode,
          }}
        />
        {healthData.length != 0 && (
          <View className="flex-row justify-between w-full -translate-y-5">
            <Text className="text-[#ffa726] text-xs">{firstLabel}</Text>
            <Text className="text-[#ffa726] text-xs">{lastLabel}</Text>
          </View>
        )}

        <View className="flex-row justify-around">
          {["All Time", "1 Year", "1 Month", "1 Day"].map((period) => (
            <Pressable
              key={period}
              onPress={() => setTimeFilter(period)}
              className="p-2"
            >
              <Text
                className={`text-lg ${
                  timeFilter === period ? "text-[#ffa726]" : `text-${inverseThema}`
                }`}
              >
                {period}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }
}
