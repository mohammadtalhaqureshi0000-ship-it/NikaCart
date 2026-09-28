
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setCategory,
  setPrice,
  clearFilters,
} from "../features/Product/productSlice";

const ProductFilter = () => {
  const dispatch = useDispatch();

  const { category, price, searchQuery, sortBy } = useSelector(
    (state) => state.products
  );

  const hasActiveFilters =
    category !== "all" ||
    price !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "default";

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-100 via-slate-100 to-gray-200 p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          Filters
        </h2>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => dispatch(clearFilters())}
            className="text-sm font-semibold text-red-500 transition hover:text-red-700"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-base font-semibold text-slate-800">
          Category
        </h3>

        <div className="flex flex-col gap-3">
          {["all", "One Piece"].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition hover:text-sky-700"
            >
              <input
                type="radio"
                name="category"
                value={item}
                checked={category === item}
                onChange={() => dispatch(setCategory(item))}
                className="h-4 w-4 accent-sky-500"
              />

              {item === "all" ? "All Categories" : item}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-base font-semibold text-slate-800">
          Price Range
        </h3>

        <div className="flex flex-col gap-3">
          {[
            { value: "all", label: "All Prices" },
            { value: "0-30", label: "$0 – $30" },
            { value: "31-60", label: "$31 – $60" },
            { value: "61-100", label: "$61 – $100" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition hover:text-sky-700"
            >
              <input
                type="radio"
                name="price"
                value={item.value}
                checked={price === item.value}
                onChange={() => dispatch(setPrice(item.value))}
                className="h-4 w-4 accent-sky-500"
              />

              {item.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => dispatch(clearFilters())}
        disabled={!hasActiveFilters}
        className="w-full rounded-lg bg-sky-500 px-4 py-3 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default ProductFilter;