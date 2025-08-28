"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { config, ZodConfig } from "@/utils/zod";

type FormData = {
  iso_class: number | string;
  particle_size: number | string;
  airflow: number | string;
  operating_hours_per_year: number | string;
  fan_efficiency: number | string;
  electricity_rate: number | string;
  upstream_dust_concentration: number | string;
  terminal_pressure_drop: number | string;
  iso_cleanroom_particle: number | string;
  upstream_particle_count: number | string;
};

export default function Page() {
  const inputConfigs: (ZodConfig & { name: string; label: string })[] = [
    {
      name: "iso_class",
      type: "number",
      label: "ISO Class",
      message: "ISO Class must be between 5 and 9",
      default: 5,
      min: { value: 5, message: "ISO Class must be between 5 and 9" },
      max: { value: 9, message: "ISO Class must be between 5 and 9" },
      step: 1,
    },
    {
      name: "particle_size",
      type: "number",
      label: "Particle Size (µm)",
      message: "Particle Size must be between 0.5 and 5",
      default: 0.5,
      min: { value: 0.5, message: "Particle Size must be between 0.5 and 5" },
      max: { value: 5, message: "Particle Size must be between 0.5 and 5" },
      step: 0.1,
    },
    {
      name: "airflow",
      type: "number",
      label: "Airflow (m³/h)",
      message: "Airflow must be 0 or greater",
      default: 0,
      min: { value: 0, message: "Airflow must be 0 or greater" },
      max: {
        value: 8760,
        message: "Airflow cannot exceed 8760 hours per year",
      },
      step: 1,
    },
    {
      name: "operating_hours_per_year",
      type: "number",
      label: "Operating Hours per Year (h/yr)",
      message: "Operating Hours must be 0 or greater",
      default: 0,
      min: { value: 0, message: "Operating Hours must be 0 or greater" },
      max: {
        value: 8760,
        message: "Operating Hours cannot exceed 8760 hours per year",
      },
      step: 1,
    },
    {
      name: "fan_efficiency",
      type: "number",
      label: "Fan Efficiency (0-1)",
      message: "Fan Efficiency must be between 0 and 1",
      default: 0,
      min: { value: 0, message: "Fan Efficiency must be between 0 and 1" },
      max: { value: 1, message: "Fan Efficiency must be between 0 and 1" },
      step: 0.01,
    },
    {
      name: "electricity_rate",
      type: "number",
      label: "Electricity Rate ($/kWh)",
      message: "Electricity Rate must be between 0 and 1",
      default: 0,
      min: { value: 0, message: "Electricity Rate must be between 0 and 1" },
      max: { value: 1, message: "Electricity Rate must be between 0 and 1" },
      step: 0.01,
    },
    {
      name: "upstream_dust_concentration",
      type: "number",
      label: "Upstream Dust Concentration (mg/m³)",
      message: "Upstream Dust Concentration must be between 0 and 1",
      default: 0,
      min: {
        value: 0,
        message: "Upstream Dust Concentration must be between 0 and 1",
      },
      max: {
        value: 1,
        message: "Upstream Dust Concentration must be between 0 and 1",
      },
      step: 0.01,
    },
    {
      name: "terminal_pressure_drop",
      type: "number",
      label: "Terminal Pressure Drop (Pa)",
      message: "Terminal Pressure Drop must be between 0 and 1",
      default: 0,
      min: {
        value: 0,
        message: "Terminal Pressure Drop must be between 0 and 1",
      },
      max: {
        value: 1,
        message: "Terminal Pressure Drop must be between 0 and 1",
      },
      step: 0.01,
    },
    {
      name: "iso_cleanroom_particle",
      type: "number",
      label: "ISO Cleanroom Particle (1/m³)",
      message: "ISO Cleanroom Particle must be between 0 and 1",
      disabled: true,
      optional: true,
    },
    {
      name: "upstream_particle_count",
      type: "number",
      label: "Upstream Particle Count",
      message: "Upstream Particle Count must be between 0 and 1",
      default: 0,
      min: {
        value: 0,
        message: "Upstream Particle Count must be between 0 and 1",
      },
      max: {
        value: 1,
        message: "Upstream Particle Count must be between 0 and 1",
      },
      step: 1,
    },
  ];

  const formSchema = z.object(
    inputConfigs.reduce((acc, value) => {
      acc[value.name] = config(value as ZodConfig);
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    mode: "onChange", // This ensures validation runs on every change
    defaultValues: inputConfigs.reduce((acc, value) => {
      acc[value.name as keyof FormData] = value?.default ?? "";
      return acc;
    }, {} as FormData),
  });

  const onSubmit = (values: FormData) => {
    const iso_class = Number(values.iso_class);
    const particle_size = Number(values.particle_size);

    const iso_cleanroom_particle =
      Math.pow(10, iso_class) * Math.pow(0.1 / particle_size, 2.08);

    form.setValue("iso_cleanroom_particle", iso_cleanroom_particle);
  };
  return (
    <div className="p-8 space-x-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {inputConfigs.map((value) => (
            <FormField
              key={value.name}
              control={form.control}
              name={value.name as keyof FormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{value?.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={value?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={value?.disabled}
                      step={value?.step}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit">Calculate</Button>
        </form>
      </Form>

      <div></div>
    </div>
  );
}
