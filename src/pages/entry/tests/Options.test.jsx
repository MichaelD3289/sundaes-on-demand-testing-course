import { render, screen } from "@testing-library/react";

import Options from "../Options";

test("displays image for each scoopoption from server", async () => {
  render(<Options optionType="scoops" />);

  // find the images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // confirm alt text of images
  const altText = scoopImages.map((e) => e.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});
