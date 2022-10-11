import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  const hotFudgeTopping = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "2");
  await user.click(hotFudgeTopping);

  // find and click order button
  const orderBtn = await screen.findByRole("button", { name: "Order Sundae!" });
  await user.click(orderBtn);

  // check summary information based on order
  const scoopsSubtotal = screen.getByRole("heading", { name: /scoops: \$/i });
  const toppingsSubtotal = screen.getByRole("heading", {
    name: /toppings: \$/i,
  });
  const grandTotal = screen.getByRole("heading", { name: /total \$/i });

  expect(scoopsSubtotal).toHaveTextContent("4.00");
  expect(toppingsSubtotal).toHaveTextContent("1.50");
  expect(grandTotal).toHaveTextContent("5.50");

  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(["2 Chocolate", "1 Hot fudge"]);
  // OR
  // expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  // expect(screen.getByText("1 Hot fudge")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const termsConditionsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmOrderBtn = screen.getByRole("button", { name: "Confirm order" });

  await user.click(termsConditionsCheckbox);
  await user.click(confirmOrderBtn);

  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByRole("heading", {
    name: "Your order number is 2134823570",
  });
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderBtn = screen.getByRole("button", { name: "Create new order" });
  await user.click(newOrderBtn);

  // check that the scoops and toppings subtotals have been reset
  const scoopsSubtotalReset = screen.getByRole("heading", {
    name: /scoops: \$/i,
  });
  const toppingsSubtotalReset = screen.getByRole("heading", {
    name: /toppings: \$/i,
  });

  expect(scoopsSubtotalReset).toHaveTextContent("0.00");
  expect(toppingsSubtotalReset).toHaveTextContent("0.00");

  // do we need to await anything to avoid test errors?
  // these are awaited at end of test to ensure no test errors from component updates after test is complete
  await screen.findByRole("spinbutton", { name: "Chocolate" });
  await screen.findByRole("checkbox", { name: "Hot fudge" });
});
