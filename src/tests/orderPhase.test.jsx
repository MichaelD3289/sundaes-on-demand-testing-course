import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  const hotFudgeTopping = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  userEvent.clear(chocolateScoop);
  userEvent.type(chocolateScoop, "2");
  userEvent.click(hotFudgeTopping);

  // find and click order button
  const orderBtn = await screen.findByRole("button", { name: "Order Sundae!" });
  userEvent.click(orderBtn);

  // check summary information based on order
  const scoopsSubtotal = screen.getByRole("heading", { name: /scoops: \$/i });
  const toppingsSubtotal = screen.getByRole("heading", {
    name: /toppings: \$/i,
  });

  expect(scoopsSubtotal).toHaveTextContent("4.00");
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // removed due to mockup change, can be uncommented if reverted back
  // const grandTotal = screen.getByRole("heading", { name: /total \$/i });
  // expect(grandTotal).toHaveTextContent("5.50");

  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(["2 Chocolate", "Hot fudge"]);
  // OR
  // expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  // expect(screen.getByText("1 Hot fudge")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const termsConditionsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmOrderBtn = screen.getByRole("button", { name: "Confirm order" });

  userEvent.click(termsConditionsCheckbox);
  userEvent.click(confirmOrderBtn);

  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderBtn = screen.getByRole("button", { name: "Create new order" });
  userEvent.click(newOrderBtn);

  // check that the scoops and toppings subtotals have been reset
  const scoopsSubtotalReset = await screen.findByText("Scoops total: $0.00");
  const toppingsSubtotalReset = await screen.findByText(
    "Toppings total: $0.00"
  );

  expect(scoopsSubtotalReset).toBeInTheDocument();
  expect(toppingsSubtotalReset).toBeInTheDocument();

  // do we need to await anything to avoid test errors?
  // these are awaited at end of test to ensure no test errors from component updates after test is complete
  await screen.findByRole("spinbutton", { name: "Chocolate" });
  await screen.findByRole("checkbox", { name: "Hot fudge" });
});
