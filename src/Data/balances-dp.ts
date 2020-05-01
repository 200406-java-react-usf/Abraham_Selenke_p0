import { Balance } from '../models/balances'

//False information to test logic
let total = 0;
let request = 0;
let id = 1;

export default [
    new Balance(id++, 15000, 1200, 950, total, request, 1),
    new Balance(id++, 1000, 250, 1000, total, request, 2),
    new Balance(id++, 1000, 200, 800, total, request, 3),
    new Balance(id++, 15000, 1000, 750, total, request, 4),
    new Balance(id++, 1000, 150, 850, total, request, 5),
    new Balance(id++, 1000, 100, 900, total, request,6)
]                                       