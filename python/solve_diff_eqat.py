from sympy import symbols, Eq, dsolve
from sympy.parsing.latex import parse_latex
import sys, json

latex_input = sys.argv[1]  # 從命令列收到 LaTeX 字串

expr = parse_latex(latex_input)  # 解析成 SymPy 表達式
x = symbols('x')
# 假設微分方程為 dy/dx = x, y(0)=0
sol = dsolve(expr)

print(sol)
