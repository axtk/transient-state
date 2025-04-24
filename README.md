# transient-state

Uncluttered async action state tracking for React apps: No need to rearrange the app's shared state setup and to rewrite the async actions.

Installation: `npm i transient-state`

## Example

```js
import {useTransientState} from 'transient-state';

const ItemList = () => {
    let [items, setItems] = useState();
    let [state, withState] = useTransientState('fetch-items');

    useEffect(() => {
        // wrapped fetchItems() to track the async action state
        withState(fetchItems()).then(setItems);
    }, [fetchItems, withState]);

    if (!state.complete)
        return <p>Loading...</p>;

    return <ul>{items.map(/* ... */)}</ul>;
};

const Status = () => {
    // reading the 'fetch-items' state from ItemList
    let [state] = useTransientState('fetch-items');

    if (!state.complete)
        return 'Busy';

    if (state.error)
        return 'Error';

    return 'OK';
};
```

[Live demo](https://codesandbox.io/p/sandbox/transient-state-demo-3xwl78?file=%2Fsrc%2FItemList.js%3A11%2C19)
