import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { within, userEvent } from "@storybook/testing-library"
import Main from "../app/core/components/Container/Main"

export default {
  title: "Container/Main",
  component: Main,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Main>

const Template: ComponentStory<typeof Main> = (args) => <Main />

export const LoggedOut = Template.bind({})
