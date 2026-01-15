"use client"

import * as React from "react"
import { Pie, PieChart, Tooltip, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
} from "@/components/ui/chart"
import axios from "axios";

const COLORS = ['#0D47A1', '#1976D2', '#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB'];

interface ChartData {
  name: string;
  value: number;
}

interface DealItem {
  user: string;
  deals: number;
}

export function UntouchedDealsPieChart() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [totalDeals, setTotalDeals] = React.useState(0);
  

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/untouched_deals_by_user`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        const { dealsByUser, totalUntouchedDeals } = response.data.data;
        setChartData(dealsByUser.map((item: DealItem) => ({ name: item.user, value: item.deals })));
        setTotalDeals(totalUntouchedDeals);
      } catch (error) {
        console.error("Error fetching untouched deals data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col bg-accent/40 h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>Untouched Deals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4 pt-0">
        <div className="relative flex items-center justify-center w-full" style={{ height: '200px' }}>
          <ChartContainer config={{}} className="mx-auto aspect-square h-full w-full">
            <PieChart>
              <Tooltip
                cursor={false}
                wrapperStyle={{ zIndex: 1000 }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 text-sm bg-background rounded-md shadow-lg">
                        <p className="font-semibold">{payload[0].name} ({payload[0].value})</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={90} fill="#8884d8" strokeWidth={2}>
                {chartData.map((_entry, index) => (
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
