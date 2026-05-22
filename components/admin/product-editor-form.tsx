"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import { upsertProductAction } from "@/lib/actions";
import type { ActionResult, Product } from "@/types";

const defaultSizeOptions = ["XS", "S", "M", "L", "XL"];
const defaultKidSizeOptions = ["2Y", "4Y", "6Y", "8Y", "10Y"];

type SizeRow = { id: string; value: string };
type ColorRow = { id: string; name: string };
type ViewRow = { id: string; label: string; existingImageUrl?: string };

const initialActionState: ActionResult = {
  status: "idle"
};

function createRowId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const colorKeywordMap: Record<string, string> = {
  "burnt earth": "#8B3A2A",
  "indigo night": "#1E2E52",
  "forest dusk": "#2A4A2E",
  "faded rose": "#8B4A55",
  "saffron sun": "#9A6B10",
  "ash & smoke": "#3A3530",
  "ash and smoke": "#3A3530",
  natural: "#D8CFBE",
  cream: "#F5E6CC",
  beige: "#DCC7A1",
  tan: "#C19A6B",
  brown: "#8B5A2B",
  rust: "#B7410E",
  terracotta: "#C96B4B",
  clay: "#A66A4C",
  coral: "#FF7F50",
  red: "#C0392B",
  burgundy: "#800020",
  maroon: "#6B1F2A",
  pink: "#E8A0BF",
  blush: "#E8C7C8",
  rose: "#B76E79",
  peach: "#F4A88B",
  orange: "#E67E22",
  yellow: "#E2B93B",
  gold: "#C9A227",
  olive: "#708238",
  green: "#2E8B57",
  mint: "#98D8C8",
  teal: "#2C7A7B",
  blue: "#3B82F6",
  navy: "#1F2A44",
  indigo: "#3F51B5",
  purple: "#7E57C2",
  lavender: "#B497D6",
  lilac: "#C8A2C8",
  white: "#F8F8F5",
  grey: "#8C8C8C",
  gray: "#8C8C8C",
  charcoal: "#36454F",
  black: "#1F1F1F"
};

function normalizeColorName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveSwatchColor(name: string) {
  const normalizedName = normalizeColorName(name);

  if (!normalizedName) {
    return "#D8CFBE";
  }

  const mapped = colorKeywordMap[normalizedName];

  if (mapped) {
    return mapped;
  }

  if (typeof CSS !== "undefined" && CSS.supports("color", normalizedName)) {
    return normalizedName;
  }

  return "#D8CFBE";
}

function getInitialFormState(product?: Product | null) {
  const category = product?.category ?? "women";
  const sizes =
    product?.sizes.length
      ? product.sizes.map((value) => ({ id: createRowId("size"), value }))
      : defaultSizeOptions.map((value) => ({ id: createRowId("size"), value }));
  const colors =
    product?.colors.length
      ? product.colors.map((color) => ({
          id: createRowId("color"),
          name: color.name
        }))
      : [{ id: createRowId("color"), name: "" }];
  const views =
    product?.views.length
      ? product.views.map((view) => ({
          id: createRowId("view"),
          label: view.label,
          existingImageUrl: view.imageUrl
        }))
      : [
          { id: createRowId("view"), label: "Front" },
          { id: createRowId("view"), label: "Back" }
        ];

  return { category, sizes, colors, views };
}

export function ProductEditorForm({
  initialProduct,
  submitLabel = "Save Product",
  onCancel
}: {
  initialProduct?: Product | null;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();
  const [actionState, formAction, isPending] = useActionState(upsertProductAction, initialActionState);
  const [category, setCategory] = useState("women");
  const [sizes, setSizes] = useState<SizeRow[]>([]);
  const [colors, setColors] = useState<ColorRow[]>([]);
  const [views, setViews] = useState<ViewRow[]>([]);

  useEffect(() => {
    const next = getInitialFormState(initialProduct);
    setCategory(next.category);
    setSizes(next.sizes);
    setColors(next.colors);
    setViews(next.views);
  }, [initialProduct]);

  useEffect(() => {
    if (actionState.status === "idle" || !actionState.message) {
      return;
    }

    showToast({
      title: actionState.message,
      variant: actionState.status === "success" ? "success" : "error"
    });

    if (actionState.status === "success") {
      if (initialProduct) {
        onCancel?.();
      } else {
        formRef.current?.reset();
        const next = getInitialFormState(null);
        setCategory(next.category);
        setSizes(next.sizes);
        setColors(next.colors);
        setViews(next.views);
      }
    }
  }, [actionState, initialProduct, onCancel, showToast]);

  function updateSizeRow(id: string, value: string) {
    setSizes((current) => current.map((row) => (row.id === id ? { ...row, value } : row)));
  }

  function updateColorRow(id: string, value: string) {
    setColors((current) => current.map((row) => (row.id === id ? { ...row, name: value } : row)));
  }

  function updateViewRow(id: string, value: string) {
    setViews((current) => current.map((row) => (row.id === id ? { ...row, label: value } : row)));
  }

  function applySuggestedSizes(nextCategory: string) {
    const suggestion = nextCategory === "kids" ? defaultKidSizeOptions : defaultSizeOptions;
    setSizes((current) =>
      current.some((row) => row.value.trim())
        ? current
        : suggestion.map((value) => ({
            id: createRowId("size"),
            value
          }))
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6" encType="multipart/form-data">
      <input type="hidden" name="productId" value={initialProduct?.id ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product Name" name="name" defaultValue={initialProduct?.name ?? ""} />
        <Field label="Material" name="material" defaultValue={initialProduct?.material ?? ""} />
        <Field label="Price (NGN)" name="price" type="number" min="0" defaultValue={initialProduct?.price ?? ""} />
        <Field label="Inventory" name="inventory" type="number" min="0" defaultValue={initialProduct?.inventory ?? ""} />
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              applySuggestedSizes(nextCategory);
            }}
            className="flex h-12 w-full rounded-none border border-clay bg-transparent px-4 py-2 text-sm text-charcoal outline-none transition-colors focus:border-charcoal"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <Field
          label="Product Type"
          name="type"
          placeholder="dress, t-shirt, trousers..."
          defaultValue={initialProduct?.type ?? ""}
        />
        <div className="space-y-2">
          <Label htmlFor="print">Print</Label>
          <select
            id="print"
            name="print"
            defaultValue={initialProduct?.print ?? "plain"}
            className="flex h-12 w-full rounded-none border border-clay bg-transparent px-4 py-2 text-sm text-charcoal outline-none transition-colors focus:border-charcoal"
          >
            <option value="plain">Plain</option>
            <option value="adire">Adire</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={initialProduct?.description ?? ""} />
      </div>

      <section className="space-y-4 border border-linen-dark p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-light">Sizes</p>
            <p className="text-sm text-text-muted">Add as many sizes as this product needs.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSizes((current) => [...current, { id: createRowId("size"), value: "" }])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Size
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {sizes.map((row, index) => (
            <div key={row.id} className="flex gap-2">
              <Input
                name="sizes"
                value={row.value}
                placeholder={index === 0 ? "S" : "Add size"}
                onChange={(event) => updateSizeRow(row.id, event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSizes((current) => current.filter((item) => item.id !== row.id))}
                disabled={sizes.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border border-linen-dark p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-light">Colours</p>
            <p className="text-sm text-text-muted">Name the colour and pick the exact swatch visually.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setColors((current) => [...current, { id: createRowId("color"), name: "" }])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Colour
          </Button>
        </div>
        <div className="space-y-4">
          {colors.map((row) => (
            <div key={row.id} className="grid gap-3 md:grid-cols-[1fr_76px_60px]">
              <Input
                name="colorName"
                value={row.name}
                placeholder="Burnt Earth"
                onChange={(event) => updateColorRow(row.id, event.target.value)}
              />
              <div
                className="h-12 w-full border border-clay"
                style={{ background: resolveSwatchColor(row.name) }}
                aria-label={`${row.name || "Product"} colour preview`}
              />
              <input type="hidden" name="colorSwatch" value={resolveSwatchColor(row.name)} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setColors((current) => current.filter((item) => item.id !== row.id))}
                disabled={colors.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border border-linen-dark p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-light">Product Images</p>
            <p className="text-sm text-text-muted">Upload one or more product images and label each angle.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViews((current) => [...current, { id: createRowId("view"), label: "" }])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
        <div className="space-y-4">
          {views.map((row) => (
            <div key={row.id} className="grid gap-3 border border-border p-4 md:grid-cols-[180px_1fr_60px]">
              <Input
                name="viewLabel"
                value={row.label}
                placeholder="Front"
                onChange={(event) => updateViewRow(row.id, event.target.value)}
              />
              <div className="space-y-2">
                <Input name="viewImage" type="file" accept="image/*" />
                <input type="hidden" name="existingViewImageUrl" value={row.existingImageUrl ?? ""} />
                {row.existingImageUrl ? (
                  <Image src={row.existingImageUrl} alt={row.label} width={64} height={64} className="h-16 w-16 object-cover" />
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViews((current) => current.filter((item) => item.id !== row.id))}
                disabled={views.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="details">Details & Fit</Label>
          <Textarea
            id="details"
            name="details"
            placeholder="One detail per line"
            defaultValue={initialProduct?.details?.join("\n") ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shipping">Shipping & Returns</Label>
          <Textarea
            id="shipping"
            name="shipping"
            placeholder="One shipping note per line"
            defaultValue={initialProduct?.shipping?.join("\n") ?? ""}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-earth">
        <input type="checkbox" name="featured" defaultChecked={initialProduct?.featured ?? false} />
        Featured product
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  min,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  min?: string;
  defaultValue?: string | number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} min={min} defaultValue={defaultValue} required />
    </div>
  );
}
