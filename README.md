# transient-state

Uncluttered async action state tracking for React apps: No need to rearrange the app's shared state setup and to rewrite the async actions.

Installation: `npm i transient-state`

## Usage

Objective: Track the pending state of the async `fetchItems()` action to tell the user whether the UI is busy or encountered an error (preferably without rewriting the action and the app's state management).

```diff
import {useTransientState} from 'transient-state';

const ItemList = () => {
    const [items, setItems] = useState([]);
    // the custom string key parameter tags the action's state so
    // that another component can access this state by the same tag
+   const [state, withState] = useTransientState('fetch-items');

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

const Status = () => {
    // reading the 'fetch-items' state updated in ItemList
+   const [state] = useTransientState('fetch-items');

    if (!state.initialized)
        return 'Initial';

    if (!state.complete)
        return 'Busy';

    if (state.error)
        return 'Error';

    return 'OK';
};
```

[Live demo](https://codesandbox.io/p/sandbox/shared-transient-state-demo-35ktct?file=%2Fsrc%2FItemList.js)

🔹 If the action's state is only used within a single component, it can be used locally by omitting the custom string key parameter of the `useTransientState()` hook.

```diff
- const [state, withState] = useTransientState('fetch-items');
+ const [state, withState] = useTransientState();
```

🔹 In the example above, the action's value (the `items` array) is stored in the component's local state, but it can certainly live in the app's shared state of the developer's choice instead.

🔹 Silently tracking the action's pending state, e.g. with background or optimistic updates (preventing `state.complete` from switching to `false` in the pending state):

```diff
- withState(fetchItems())
+ withState(fetchItems(), {silent: true})
```

🔹 Revealing the action's pending state after a delay (e.g. to avoid flashing a process indicator when the action is likely to complete by the end of the delay):

```diff
- withState(fetchItems())
+ withState(fetchItems(), {delay: 500})
```

🔹 Allowing the action's Promise value to reject explicitly (e.g. in order to provide the action with a custom rejection handler) along with exposing `state.error` that goes by default:

```diff
- withState(fetchItems())
+ withState(fetchItems(), {throws: true}).catch(handleError)
```

🔹 Providing an isolated instance of initial shared action state, e.g. for tests or SSR (it can be unnecessary for client-side rendering where the default context value is sufficient, but it can also be used to separate action states of larger self-contained portions of a web app):

```diff
+ import {TransientStateProvider} from 'transient-state';

- <App/>
+ <TransientStateProvider>
+     <App/>
+ </TransientStateProvider>
```
