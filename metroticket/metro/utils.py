from collections import defaultdict
import heapq
from .models import Route

def build_station_graph():
    routes = Route.objects.all()
    graph = defaultdict(list)
    
    for route in routes:
        source = route.source.id
        destination = route.destination.id
        cost = route.price
        graph[source].append((destination, cost))
        graph[destination].append((source, cost))  
    
    return graph


def dijkstra_shortest_path(graph, start, end):
    
    queue = [(0, start, [])]  
    visited = set()
    
    while queue:
        total_cost, current, path = heapq.heappop(queue)
        if current in visited:
            continue
        visited.add(current)
        path = path + [current]
        
        if current == end:
            return total_cost, path
        
        for neighbor, edge_cost in graph.get(current, []):
            if neighbor not in visited:
                heapq.heappush(queue, (total_cost + edge_cost, neighbor, path))
    
    return float('inf'), []  