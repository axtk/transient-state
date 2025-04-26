# transient-state

Uncluttered async action state tracking for React apps: No need to rearrange the app's shared state setup and to rewrite the async actions.

Installation: `npm i transient-state`

## Usage

Objective: Track the pending state of the async `fetchItems()` action to tell the user whether the UI is busy or encountered an error (preferably without rewriting the action and the app's state management).

```diff
import {useTransientState} from 'transient-state';

const ItemList = () => {
    const [items, setItems] = useState([]);
    // with the optional custom string key parameter, `state` can be
    // accessed from other components, and only locally without a key
+   const [state, withState] = useTransientState('fetch-items');

    useEffect(() => {
        // wrapped fetchItems() to track the async action's state
-       fetchItems().then(setItems);
+       withState(fetchItems()).then(setItems);
    }, [fetchItems, withState]);

+   if (!state.complete)
+       return <p>Loading...</p>;

+   if (state.error)
+       return <p>An error occurred</p>;

    return <ul>{items.map(/* ... */)}</ul>;
};

const Status = () => {
    // reading the 'fetch-items' state updated in ItemList
    const [state] = useTransientState('fetch-items');

    if (!state.complete)
        return 'Busy';

    if (state.error)
        return 'Error';

    return 'OK';
};
```

[Live demo](https://codesandbox.io/p/sandbox/transient-state-demo-3xwl78?file=%2Fsrc%2FItemList.js)

Silently tracking the action's pending status, e.g. for background or optimistic updates (without setting `state.complete` to `false` in the pending status):

```diff
- withState(fetchItems())
+ withState(fetchItems(), {silent: true})
```

Revealing the action's pending status after a delay to avoid flashing a process indicator when the action is expected to complete quickly most of the times:

```diff
- withState(fetchItems())
+ withState(fetchItems(), {delay: 500})
```
