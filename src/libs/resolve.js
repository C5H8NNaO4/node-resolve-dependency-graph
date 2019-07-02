import {debug} from 'node-tag-log/lib'
const Node = (name) => ({
	edges: [],
    name
})


function addEdges (nodes, key, edges) {
    let node = nodes[key];
    debug`Adding edges to ${node.name} - ${edges}`
    for (let edge of edges) {
        if (!nodes [edge]) throw new Error (`Unmet dependency '${edge}' at node ${node.name}`)
        node.edges.push (nodes[edge]);
    }
}

function resolveDependencies (node,resolved, unresolved, global) {
  	debug`resolving node ${node.name}`
    unresolved.push (node);
    for (let edge of node.edges) {
        if (!~resolved.indexOf (edge)) {
			if (!!~unresolved.indexOf (edge)) throw new Error ('Circular dependency');
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
    debug`Generating flat node list from graph ${graph}`
    for (var key in graph) {        
        nodes[key] = Node (key);
    }
    for (var key in graph) {
        let node = nodes[key], edges = graph[key];
        if (node) addEdges (nodes, key, edges);
    }

    return nodes;
}

export const resolve = (depList) => { 
    let resolved, result = [], global=[]
    let nodes = genNodes (depList);
    for (var key in nodes) {
        let node = nodes [key];
		if (!!~global.indexOf (node)) continue;
        resolved = []
        resolveDependencies (node, resolved, [], global);
        result.push (resolved);
    }
    return {
        resolved: resolved.map (node => node.name)
    }
}