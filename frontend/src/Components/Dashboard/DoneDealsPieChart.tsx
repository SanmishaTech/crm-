"use client"

import * as React from "react"
import { Pie, PieChart, Tooltip, Cell } from "recharts"
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartContainer,
} from "@/Components/ui/chart"
import axios from "axios";

const COLORS = ['#00529B', '#0077CC', '#009CFF', '#4DB8FF', '#99D6FF', '#CCEFFF'];

interface ChartData {
  name: string;
  value: number;
}

export function DoneDealsPieChart() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [totalDeals, setTotalDeals] = React.useState(0);
  

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/done_deals_by_user`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        const { dealsByUser, totalDoneDeals } = response.data.data;
        setChartData(dealsByUser.map(item => ({ name: item.user, value: item.deals })));
        setTotalDeals(totalDoneDeals);
      } catch (error) {
        console.error("Error fetching done deals data:", error);
      }
    };

    fetchData();
  }, []);

      return (
    <Card className="flex flex-col bg-accent/40 h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>Done Deals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4 pt-0">
        <div className="relative flex items-center justify-center w-full" style={{ height: '200px' }}>
          <ChartContainer config={{}} className="mx-auto aspect-square h-full w-full">
            <PieChart>
              <Tooltip
                wrapperStyle={{ zIndex: 1000 }}
                cursor={false}
                content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 text-sm bg-background rounded-md shadow-lg">
                      <p className="font-semibold">{payload[0].name}</p>
                    </div>
                  )
                }
                return null
              }}
              />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={90} fill="#8884d8" strokeWidth={2}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none ring-0 focus:ring-0" />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold">{totalDeals}</span>
            <span className="text-sm text-muted-foreground">Deals</span>
          </div>
        </div>
         
      </CardContent>
    </Card>
  );
}

