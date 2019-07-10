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

function resolveDependencies (node,resolved, unresolved, global) {
    unresolved.push (node);
    for (let edge of node.edges) {
        if (!~resolved.indexOf (edge)) {
			if (!!~unresolved.indexOf (edge)) throw new Error (`Circular dependency '${edge}' at node '${node.name}`);
			resolveDependencies (edge, resolved, unresolved, global)
        }
    }
 	resolved.push (node)
    if (!~global.indexOf (node))
		global.push (node)
	unresolved.splice(resolved.indexOf (node), 1)
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
export const flat = (result) => result.reduce ((flat, cur) => [...flat, ...cur]);
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
            console.log (cur, flat.length, flat.length-(i+1))
            node [cur] = i==flat.length-2?null:{};
            node = node [cur];
        }
        tree [key] = first;
    }
    return tree;
}

export const resolve = (depList) => { 
    let result = [], global=[], combined, map;
    let nodes = genNodes (depList);
    for (var key in nodes) {
        let node = nodes [key];
		//if (!!~global.indexOf (node)) continue;
        let resolved = []
        resolveDependencies (node, resolved, [], global);
        result.push (resolved);
    }
    return list (result);
}