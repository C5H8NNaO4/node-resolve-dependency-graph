const Node = (name) => ({
	edges: [],
    name
});

function addEdges (nodes, key, edges) {
    let node = nodes[key];
    for (let edge of edges) {
        if (!nodes [edge]) throw new Error (`Unmet dependency '${edge}' at node ${node.name}`)
        node.edges.push (nodes[edge]);
    }
}

function resolveDependencies (node,resolved, unresolved) {
    unresolved.push (node);
    for (let edge of node.edges) {
        if (!~resolved.indexOf (edge)) {
			if (!!~unresolved.indexOf (edge)) throw new Error (`Circular dependency '${edge}' at node '${node.name}`);
			resolveDependencies (edge, resolved, unresolved)
        }
    }
 	resolved.push (node)
    unresolved.splice(resolved.indexOf (node), 1)
    return resolved;
}

function genNodes (graph) {
    let nodes = {};
    for (var key in graph) {        
        nodes[key] = Node (key);
    }
    for (var key in graph) {
        let node = nodes[key], edges = graph[key];
        if (node) addEdges (nodes, key, edges);
    }
    return nodes;
}

const list = (result) => result.map (resolved => resolved.map (node => node.name));

export const flat = (result) => result
    .reduce ((flat, cur) => [...flat, ...cur])
    .reverse ().filter ((e,i,a) => !~a.indexOf (e,i+1)).reverse ()

export const map  = (result) => result
    .map (sub => sub.slice (0))
    .reduce ((map,result) => Object.assign({
        [result[result.length - 1]]: result
    },map),{});

export const tree = (result) => {
    let tmp = map(result);
    let tree = Object.assign ({},tmp);
    for (let key in tree) {
        let flat = tree [key];
        let node, first = node = flat.length==1?null:{};
        for (var i=0; i<flat.length-1; i++) {
            var cur = flat [i];
            node [cur] = i==flat.length-2?null:{};
            node = node [cur];
        }
        tree [key] = first;
    }
    return tree;
}

export const resolve = (depMap) => { 
    let result = [], nodes = genNodes (depMap);
    for (var key in nodes) {
        let node = nodes [key], 
            resolved = resolveDependencies (node, [], []);
        result.push (resolved);
    }
    return list (result);
}

export const resolveMap = (depMap) => {
    return map (resolve (depMap))
}