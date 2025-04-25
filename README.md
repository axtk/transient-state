# transient-state

Uncluttered async action state tracking for React apps: No need to rearrange the app's shared state setup and to rewrite the async actions.

Installation: `npm i transient-state`

## Usage

Objective: Track the pending state of the async `fetchItems()` action to tell the user whether the UI is busy (preferably without rewriting the action and the app's state management).

- add `const [state, withState] = useTransientState('action-key');`, with a custom string key parameter to access the state from other components, or without a key to use `state` locally;
- wrap the async action into `withState()` returned from the hook: `withState(fetchItems())`, which preserves the action's returned value;
- use the `state` object returned from the hook to handle the action's pending (`!state.complete`) or failed (`state.error`) status.

```js
import {useTransientState} from 'transient-state';

const ItemList = () => {
    const [items, setItems] = useState();
    const [state, withState] = useTransientState('fetch-items');

    useEffect(() => {
        // wrapped fetchItems() to track the async action state
        withState(fetchItems()).then(setItems);
    }, [fetchItems, withState]);

    if (!state.complete)
        return <p>Loading...</p>;

    return <ul>{items.map(/* ... */)}</ul>;
};

const Status = () => {
    // reading the 'fetch-items' state updated in ItemList
    let [state] = useTransientState('fetch-items');

    if (!state.complete)
        return 'Busy';

    if (state.error)
        return 'Error';

    return 'OK';
};
```

[Live demo](https://codesandbox.io/p/sandbox/transient-state-demo-3xwl78?file=%2Fsrc%2FItemList.js%3A11%2C19)
