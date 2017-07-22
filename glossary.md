---
layout: page
title: Glossary
permalink: /glossary/
---

<p>Terms used in describing question graphs</p>

<dl>
  <dt>Base Path</dt>
  <dd>
    The route through a Sequential Path which avoids any conditional paths.
  </dd>

  <dt>Compound Conditional Path</dt>
  <dd>
    A Conditional Path with it's own nested, conditional paths.
  </dd>

  <dt>Conditional 'Next'</dt>
  <dd>
    A property that points to the next node in a Conditional Path. This will be defined in the Question json File.
  </dd>

  <dt>Conditional Path</dt>
  <dd>
    An optional, offshoot path that exposes users to extra questions or let's them skip questions in the Base Path.
  </dd>

  <dt>Detour Path</dt>
  <dd>
    A type of Conditional Path which exposes users to additional questions.
  </dd>

  <dt>End Point Node</dt>
  <dd>
    The question set at the end of a conditional path
  </dd>

  <dt>Graph Length</dt>
  <dd>
    The total number of question sets encountered by a user from start to finish during quiz or survey. Can include from one to many paths e.g. a simple Sequential or a path which includes several conditional branches.
  </dd>

  <dt>Multi-Branch Path</dt>
  <dd>
    A question node that has multiple, conditional paths available for user to choose from.
  </dd>

  <dt>Multi-Node Path</dt>
  <dd>
    A path containing more than one node. Almost all Sequential paths will be multi-node. Conditional Paths might often contain just a single node.
  </dd>

  <dt>Path Length</dt>
  <dd>
    The total number of nodes for a given path including the start and end point nodes.
  </dd>

  <dt>Path Delta</dt>
  <dd>
    The difference in path lengths between a Sequential Path and a Conditional Path. For example Detour Paths would have a positive integer as a delta value because they add nodes to the overall quiz or survey.
  </dd>

  <dt>Question Graph</dt>
  <dd>
    A method of defining paths through sets of questions.
  </dd>

  <dt>Node</dt>
  <dd>
  A question and set of answers displayed on a single screen in a quiz and defined in the same scope block within the questions json file. Each node has a unique id. Multiple nodes combine to create a path with the graph json file.
  </dd>

  <dt>Question Set</dt>
  <dd>
    A group of related questions displayed on one screen. A Question Set is a type of Node associated with a survey.
  </dd>

  <dt>Sequential Path</dt>
  <dd>
    The simplest of path structures. Defined in a graph file. Does not contain conditional paths.
  </dd>

  <dt>Sequential 'Next'</dt>
  <dd>
    A property that points to the next node in a Base Path. This will be defined in the Graph json File.
  </dd>

  <dt>Shortcut Path</dt>
  <dd>
    A type of Conditional Path that allows users to bypass questions on the Base Path.
  </dd>

  <dt>Start Point Node</dt>
  <dd>
    The question set at the start of a conditional path
  </dd>

</dl>