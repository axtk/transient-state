# transient-state

Uncluttered async action state tracking for React apps: No need to rearrange the app's shared state setup and to rewrite the async actions.

Installation: `npm i transient-state`

## Usage

Objective: Track the pending state of the async `fetchItems()` action to tell the user whether the UI is busy or encountered an error (preferably without rewriting the action and the app's state management).

```diff
import {useTransientState} from 'transient-state';

const ItemList = () => {
    const [items, setItems] = useState([]);
+   const [state, withState] = useTransientState();

    useEffect(() => {
        // wrapping fetchItems() to track the async action's state
-       fetchItems().then(setItems);
+       withState(fetchItems()).then(setItems);
    }, [fetchItems, withState]);

+   if (!state.complete)
+       return <p>Loading...</p>;

+   if (state.error)
+       return <p>An error occurred</p>;

    return <ul>{items.map(/* ... */)}</ul>;
};
```

Sharing the action's state across multiple components can be done by passing a custom string key to `useTransientState()` that will be assigned to the particular state:

```diff
const ItemList = () => {
    const [items, setItems] = useState([]);
-   const [state, withState] = useTransientState();
+   const [state, withState] = useTransientState('fetch-items');

    // ...
};

const Status = () => {
    // reading the 'fetch-items' state updated in ItemList
    const [state] = useTransientState('fetch-items');

    if (!state.initialized)
        return 'Initial';

    if (!state.complete)
        return 'Busy';

    if (state.error)
        return 'Error';

    return 'OK';
};
```

[Live demo](https://codesandbox.io/p/sandbox/transient-state-demo-3xwl78?file=%2Fsrc%2FItemList.js)

Silently tracking the action's pending state, e.g. with background or optimistic updates (preventing `state.complete` from switching to `false` in the pending state):

```diff
- withState(fetchItems())
+ withState(fetchItems(), {silent: true})
```

Revealing the action's pending state after a delay to avoid flashing a process indicator when the action is likely to complete by the end of the delay:

```diff
- withState(fetchItems())
+ withState(fetchItems(), {delay: 500})
```
