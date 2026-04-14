"use client"

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
import useFetchData from "@/lib/HTTP/useFetchData";

const COLORS = ['#00529B', '#0077CC', '#009CFF', '#4DB8FF', '#99D6FF', '#CCEFFF'];

// Removed unused ChartData
interface LeadSourceData {
  lead_source: string;
  count: number;
}

interface Props {
  title?: string;
  label?: string;
}

export function LeadSourcePieChart({ title = "Lead Sources", label = "Leads" }: Props) {
  const { data: response } = useFetchData("lead_source_distribution", null, { retry: 1 });
  const leadSources: LeadSourceData[] = response?.data?.lead_sources || [];
  const chartData = leadSources.map((item: LeadSourceData) => ({ name: item.lead_source, value: item.count }));
  const totalLeads = leadSources.reduce((acc: number, item: LeadSourceData) => acc + item.count, 0);

  return (
    <Card className="flex flex-col bg-accent/40 h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>{title}</CardTitle>
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
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none ring-0 focus:ring-0" />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold">{totalLeads}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
