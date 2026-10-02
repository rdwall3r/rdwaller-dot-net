---
lastEdited: null
date: 2026-09-27
title: 'AI and Accessibility: Conversational Interaction and DOM Regeneration'
returnDestination: Writing
showDate: true
---

A month or two ago the news broke of a self-described "swarm" of AI agents, ravenous for
programmatic rewards, breaking out of their sandbox at OpenAI to compromise the machine-learning
platform "Hugging Face". The news has since been peppered with headlines about AI executives
promising restraint in the race for progress, and even urging regulation. In this time of growing
concern around AI agents and the disruption they might bring, I remain optimistic they will bring
positive and lasting change to accessibility. In this article I'd like to point out two classes of
advancement: conversational interaction and DOM regeneration.

## Conversational interaction

For all intents and purposes I began studying accessible web development in 2025. The AI age had but
dawned, and the coursework I completed contained little or no content about AI. When learning about
the "traditional" accessibility solutions such as screen readers or voice commands, I could only
assume that a massive overhaul was about to begin. As a web developer, the first thing I started
thinking about was how agents might assist with the use of web pages and apps.
[This exploratory research](https://doi.org/10.52088/ijesty.v5i3.1562) describes a tool, "Screen
Reader AI", that generates "a live semantic scene graph of the page, integrating the DOM structure,
accessibility roles (AOM data), and visual layout information". Users then may discuss the web page
or app with the agent to assist with use. The software shows promise in enhancing the user
experience in three areas: navigability, comprehension, and autonomy & confidence.

## DOM regeneration

By now I've seen many, many websites that show no concept of semantic HTML. Developers have started
to address this pervasive problem with generative AI.
[One study](https://doi.org/10.1145/3663547.3746353) used AI to regenerate DOMs for online shopping
sites. The regenerated DOMs had semantic content enhancements, while attempting to leave the page
fully functional. Some advantages of the regenerated DOM the authors cite include:

<dl class="bulleted-desc-list">
  <dt>Logical Reordering of Sections</dt>
  <dd>Reorganizes page sections into a more logical, linear sequence.</dd>
  <dt>Addition of Summary Headings</dt>
  <dd>Adds summaries to content sections and aligns them as headings.</dd>
  <dt>Enhanced Navigation Flexibility</dt>
  <dd>The regenerated version puts multiple roles on the same title element so users may navigate to the same element as a heading, link, or list item.</dd>
</dl>

## Problems

These exciting advancements aren't perfect. The conversational software generated "occasional
misreads" of page content, and it sometimes had high latency. That said, the authors reported that
82% of respondents felt these trade-offs were worth it. For the DOM regeneration study, regenerated
DOMs would sometimes come out with missing content, broken scripts, or unintended details
(hallucinations). Still, when evaluated, the regenerated DOMs received higher scores than the
originals. The authors suggested that while this could be problematic for live users, the software
could still be very practical for developers.

## Looking ahead

These two classes of advancements address some common problems screen reader users face when
navigating the web. I look forward to further advancements that are bound to come as the AI
revolution develops beyond its infancy.
