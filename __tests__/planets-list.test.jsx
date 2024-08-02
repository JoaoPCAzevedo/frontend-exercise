/**
 * Imports
 */
import { describe } from "node:test";

import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

import PlanetsList, { extractIdFromUrl } from "@/components/planets-list";

/**
 * Mocks
 */
jest.mock("swr");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({
    get: () => "",
  }),
}));

/**
 * Tests
 */
describe("Unit Tests", () => {
  test("extractIdFromUrl returns correct ID from valid URL", () => {
    const url = "https://swapi.dev/api/planets/1/";

    expect(extractIdFromUrl(url)).toBe("1");
  });

  test("extractIdFromUrl returns null for invalid URL", () => {
    const url = "https://swapi.dev/api/planets/";

    expect(extractIdFromUrl(url)).toBeNull();
  });

  test("handleSearch updates search term and calls mutate", () => {
    const replace = jest.fn();

    useRouter.mockReturnValue({ replace });

    const mockMutate = jest.fn();

    useSWR.mockReturnValue({ mutate: mockMutate });

    const { getByPlaceholderText } = render(<PlanetsList />);
    const input = getByPlaceholderText("Search by planet name...");

    fireEvent.change(input, { target: { value: "Tatooine" } });

    // Debounced function should be called after a delay
    setTimeout(() => {
      expect(replace).toHaveBeenCalledWith("/?search=Tatooine");
      expect(mockMutate).toHaveBeenCalled();
    }, 500);
  });

  test("loading function returns correct number of skeletons", () => {
    const { container } = render(<PlanetsList />);
    const skeletons = container.querySelectorAll(".w-full.h-5");

    expect(skeletons.length).toBe(10); // Assuming rowsPerPage is 10
  });
});

describe("Integration Tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    useRouter.mockClear();
    useSWR.mockClear();
  });

  test("renders planet data correctly", async () => {
    useSWR.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            name: "Planet1",
            climate: "Climate1",
            terrain: "Terrain1",
            population: "Pop1",
            url: "https://swapi.dev/api/planets/1/",
          },
        ],
      },
      error: null,
    });

    render(<PlanetsList />);

    // Wait for the data to be rendered
    await waitFor(() =>
      expect(screen.getByText("Planet1")).toBeInTheDocument()
    );
    expect(screen.getByText("Climate1")).toBeInTheDocument();
    expect(screen.getByText("Terrain1")).toBeInTheDocument();
    expect(screen.getByText("Pop1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /👁️/ })).toHaveAttribute(
      "href",
      "/planet/1"
    );
  });

  test("shows error handler on data fetch error", async () => {
    const mutate = jest.fn();

    useSWR.mockReturnValue({
      data: null,
      error: new Error("Network error"),
      mutate,
    });

    render(<PlanetsList />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });
});

describe("Snapshot test", () => {
  test("renders correctly", () => {
    const { asFragment } = render(<PlanetsList />);

    expect(asFragment()).toMatchSnapshot();
  });
});
