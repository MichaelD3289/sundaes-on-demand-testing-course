import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when scoops change", async () => {
  render(<Options optionType="toppings" />);

  // make sure default toppings subtotal is 0.00
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // find and tick one box, assert on updated subtotal
  const cherriesBox = await screen.findByRole("checkbox", { name: "Cherries" });
  userEvent.click(cherriesBox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // tick andother box, assert on subtotal
  const hotFudgeBox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  userEvent.click(hotFudgeBox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // tick one of the boxes off and assert on subtotal
  userEvent.click(cherriesBox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });

    // check that the grand total starts at $0.00
    expect(grandTotal).toHaveTextContent("0.00");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    const cherriesBox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesBox);

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });

    const cherriesBox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesBox);
    expect(grandTotal).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });

    const cherriesBox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesBox);
    expect(grandTotal).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");

    expect(grandTotal).toHaveTextContent("3.50");

    userEvent.click(cherriesBox);

    expect(grandTotal).toHaveTextContent("2.00");
  });
});
