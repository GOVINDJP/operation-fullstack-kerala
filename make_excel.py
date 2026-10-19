# -*- coding: utf-8 -*-
"""Builds Full-Stack-Study-Tracker.xlsx — the companion workbook for the roadmap."""
import datetime as dt
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.worksheet.table import Table, TableStyleInfo

import data as D

# ---------- palette ----------
CORAL = "FF6B3D"; MAGENTA = "E0457B"; PURPLE = "7C5CFF"
TEAL = "0E9F8A"; DEEP = "1E1B2E"; CREAM = "FFF9F2"
CREAM2 = "FBF5EC"; LINE = "E9E1D5"; WHITE = "FFFFFF"
GREEN_F = "E7F7EE"; AMBER_F = "FFF4DA"; PURPLE_F = "F2EEFF"; ROSE_F = "FFE9E1"; BLUE_F = "EAF5FC"

FONT = "Calibri"
thin = Side(style="thin", color=LINE)
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

def hdr(ws, row, values, fill=DEEP, height=28):
    for i, v in enumerate(values, start=1):
        c = ws.cell(row=row, column=i, value=v)
        c.font = Font(name=FONT, bold=True, color=WHITE, size=10)
        c.fill = PatternFill("solid", fgColor=fill)
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        c.border = BORDER
    ws.row_dimensions[row].height = height

def title(ws, text, sub=None, width=8):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=width)
    c = ws.cell(row=1, column=1, value=text)
    c.font = Font(name=FONT, bold=True, size=18, color=DEEP)
    c.alignment = Alignment(vertical="center")
    ws.row_dimensions[1].height = 34
    if sub:
        ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=width)
        c2 = ws.cell(row=2, column=1, value=sub)
        c2.font = Font(name=FONT, size=10, color="6A6480")
        c2.alignment = Alignment(vertical="center", wrap_text=True)
        ws.row_dimensions[2].height = 30

def widths(ws, spec):
    for col, w in spec.items():
        ws.column_dimensions[col].width = w

def body_style(ws, r1, r2, c1, c2, size=10):
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(row=r, column=c)
            cell.font = Font(name=FONT, size=size, color="2E2942")
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = BORDER

wb = Workbook()

# hidden helper sheet for dropdown lists
LISTS = wb.active
LISTS.title = "LISTS"
_lp = [x for x in D.PHASES[6]["checklist"] if not x.startswith("150 total")]
for i, v in enumerate(_lp, start=2):
    LISTS.cell(row=i, column=1, value=v)
_plat = ["LeetCode", "HackerRank", "GeeksforGeeks", "CodeChef", "Other"]
for i, v in enumerate(_plat, start=2):
    LISTS.cell(row=i, column=2, value=v)
LISTS.sheet_state = "hidden"

# =====================================================================
# 1. START HERE
# =====================================================================
ws = wb.create_sheet("START HERE")
ws.sheet_properties.tabColor = CORAL
widths(ws, {"A": 3, "B": 30, "C": 92})
title(ws, "OPERATION FULL STACK — Kerala Edition", "Your companion workbook. Works with the HTML roadmap (Full-Stack-Roadmap-Kerala.html). Tick, log, apply, repeat.", width=3)
ws["B4"] = "Your mission"; ws["B4"].font = Font(name=FONT, bold=True, size=12, color=CORAL)
ws["C4"] = ("Move from frontend intern → full-stack developer (MERN + TypeScript, with Python and Power BI as multipliers) "
            "and land a role in Kerala, South India, or a major Indian IT hub. Target window: 32 weeks.")
ws["C4"].alignment = Alignment(wrap_text=True, vertical="top")
ws.row_dimensions[4].height = 46

ws["B6"] = "How to use this workbook"; ws["B6"].font = Font(name=FONT, bold=True, size=12, color=CORAL)
usage = [
    ("DASHBOARD", "Live progress. Formulas update automatically as you fill the other tabs. Look here every Sunday."),
    ("STUDY TRACKER", "148 topic checkpoints across 9 seasons. Set Status = Done when you can explain it without notes."),
    ("WEEKLY LOG", "32 weeks pre-dated from Mon 19 Oct 2026. Log hours, DSA count, wins and blockers every week."),
    ("PROJECTS", "The 5-project ladder with milestone checklists. A project is 'done' only when it is deployed."),
    ("DSA LOG", "150 rows pre-filled with 20 patterns + 30 starter problems. 45 minutes a day from week 3."),
    ("JOB APPLICATIONS", "Every application, referral, status and follow-up date. Never lose a lead."),
    ("INTERVIEW PREP", "40 real fresher questions. Write your answer in your own words, rate confidence, revise weekly."),
    ("RESOURCES", "All verified YouTube courses, docs, PDF cheat sheets and Kerala job boards in one place."),
    ("CHEAT SHEET", "Git commands, VS Code shortcuts, JS array methods — the printable stuff."),
    ("SKILLS", "Rate yourself now vs target. Evidence column = which project proves it."),
]
r = 7
for name, desc in usage:
    ws.cell(row=r, column=2, value=name).font = Font(name=FONT, bold=True, size=10, color=PURPLE)
    c = ws.cell(row=r, column=3, value=desc)
    c.font = Font(name=FONT, size=10, color="2E2942"); c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 26
    r += 1

r += 1
ws.cell(row=r, column=2, value="The week").font = Font(name=FONT, bold=True, size=12, color=CORAL)
r += 1
for d, h, note in D.SCHEDULE_NOTES:
    ws.cell(row=r, column=2, value=d).font = Font(name=FONT, bold=True, size=10, color=DEEP)
    c = ws.cell(row=r, column=3, value="%s — %s" % (h, note))
    c.font = Font(name=FONT, size=10, color="2E2942"); c.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

r += 1
ws.cell(row=r, column=2, value="Five laws").font = Font(name=FONT, bold=True, size=12, color=CORAL)
r += 1
laws = [
    "70/30 rule: 70% building, 30% watching. Every video ends with the tab closed.",
    "One boss per season: no new phase until the deliverable is deployed.",
    "Daily commit: a green GitHub square is proof of life.",
    "45 min DSA daily from week 3 — not 5-hour Sunday marathons.",
    "One rest day. Burnout is the real final boss.",
]
for law in laws:
    ws.cell(row=r, column=2, value="•")
    c = ws.cell(row=r, column=3, value=law)
    c.font = Font(name=FONT, size=10, color="2E2942"); c.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

r += 1
ws.cell(row=r, column=2, value="Legend").font = Font(name=FONT, bold=True, size=12, color=CORAL)
r += 1
legend = [("Not started", ROSE_F, "No work yet"), ("In progress", AMBER_F, "Actively learning / building"),
          ("Done", GREEN_F, "You can explain and rebuild it"), ("Revise", PURPLE_F, "Done once, needs a second pass")]
for name, colour, desc in legend:
    c = ws.cell(row=r, column=2, value=name)
    c.fill = PatternFill("solid", fgColor=colour)
    c.font = Font(name=FONT, bold=True, size=10, color=DEEP)
    c.border = BORDER
    d = ws.cell(row=r, column=3, value=desc)
    d.font = Font(name=FONT, size=10, color="2E2942")
    r += 1

ws.sheet_view.showGridLines = False

# =====================================================================
# 2. DASHBOARD
# =====================================================================
db = wb.create_sheet("DASHBOARD")
db.sheet_properties.tabColor = MAGENTA
db.sheet_view.showGridLines = False
widths(db, {"A": 3, "B": 26, "C": 16, "D": 16, "E": 16, "F": 16, "G": 16, "H": 22})
title(db, "DASHBOARD", "Everything below is formula-driven. Fill the other tabs and this updates itself.", width=8)

# KPI cards
def kpi(cell, label, formula, colour, fmt="0"):
    c = db[cell]
    db.merge_cells(start_row=c.row, start_column=c.column, end_row=c.row, end_column=c.column + 1)
    val = db.cell(row=c.row, column=c.column, value=formula)
    val.font = Font(name=FONT, bold=True, size=26, color=colour)
    val.alignment = Alignment(horizontal="center", vertical="center")
    val.fill = PatternFill("solid", fgColor=CREAM2)
    val.number_format = fmt
    lab = db.cell(row=c.row + 1, column=c.column, value=label)
    db.merge_cells(start_row=lab.row, start_column=lab.column, end_row=lab.row, end_column=lab.column + 1)
    lab.font = Font(name=FONT, bold=True, size=9, color="6A6480")
    lab.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    lab.fill = PatternFill("solid", fgColor=CREAM2)

kpi("B3", "STUDY PROGRESS", '=IFERROR(COUNTIF(\'STUDY TRACKER\'!$H$4:$H$151,"Done")/COUNTA(\'STUDY TRACKER\'!$C$4:$C$151),0)', TEAL, "0%")
kpi("D3", "HOURS LOGGED", "=SUM('WEEKLY LOG'!$E$4:$E$35)", PURPLE, "#,##0")
kpi("F3", "DSA PROBLEMS SOLVED", '=COUNTIF(\'DSA LOG\'!$F$4:$F$153,"Solved")', CORAL)
kpi("H3", "APPLICATIONS SENT", "=COUNTA('JOB APPLICATIONS'!$B$4:$B$203)", MAGENTA)

kpi("B7", "INTERVIEWS", '=COUNTIF(\'JOB APPLICATIONS\'!$G$4:$G$203,"Interview")+COUNTIF(\'JOB APPLICATIONS\'!$G$4:$G$203,"Offer")', DEEP)
kpi("D7", "PROJECTS DEPLOYED", '=COUNTIF(\'PROJECTS\'!$I$4:$I$8,"Deployed")', TEAL)
kpi("F7", "TOPICS IN PROGRESS", '=COUNTIF(\'STUDY TRACKER\'!$H$4:$H$151,"In progress")', "B98A00")
kpi("H7", "AVG CONFIDENCE", '=IFERROR(ROUND(AVERAGEIF(\'STUDY TRACKER\'!$I$4:$I$151,">0"),1),0)', PURPLE, "0.0")

# Season progress table
db["B10"] = "SEASON PROGRESS"
db["B10"].font = Font(name=FONT, bold=True, size=12, color=DEEP)
hdr(db, 11, ["Season", "Topics done", "Total", "% complete", "Planned hrs", "Hours logged*"], fill=DEEP)

season_rows = []
row = 12
for i, p in enumerate(D.PHASES, start=1):
    label = "%s %s %s" % (p["num"], p["emoji"], p["title"])
    db.cell(row=row, column=2, value=label)
    db.cell(row=row, column=3, value='=COUNTIFS(\'STUDY TRACKER\'!$A$4:$A$151,$B%d,\'STUDY TRACKER\'!$H$4:$H$151,"Done")' % row)
    db.cell(row=row, column=4, value='=COUNTIF(\'STUDY TRACKER\'!$A$4:$A$151,$B%d)' % row)
    db.cell(row=row, column=5, value="=IFERROR(C%d/D%d,0)" % (row, row))
    db.cell(row=row, column=5).number_format = "0%"
    db.cell(row=row, column=6, value=p["hours"])
    db.cell(row=row, column=7, value=p["hours"])  # placeholder; user overwrites with actual
    season_rows.append(row)
    row += 1
last = row - 1
db.cell(row=row, column=2, value="TOTAL")
db.cell(row=row, column=3, value="=SUM(C12:C%d)" % last)
db.cell(row=row, column=4, value="=SUM(D12:D%d)" % last)
db.cell(row=row, column=5, value="=IFERROR(C%d/D%d,0)" % (row, row)).number_format = "0%"
db.cell(row=row, column=6, value="=SUM(F12:F%d)" % last)
db.cell(row=row, column=7, value="=SUM(G12:G%d)" % last)
for c in range(2, 8):
    cl = db.cell(row=row, column=c)
    cl.font = Font(name=FONT, bold=True, size=10, color=DEEP)
    cl.fill = PatternFill("solid", fgColor=CREAM2)
body_style(db, 12, row, 2, 7)
for r_ in range(12, row + 1):
    db.cell(row=r_, column=5).number_format = "0%"
    db.cell(row=r_, column=3).alignment = Alignment(horizontal="center")
    db.cell(row=r_, column=4).alignment = Alignment(horizontal="center")
    db.cell(row=r_, column=5).alignment = Alignment(horizontal="center")
    db.cell(row=r_, column=6).alignment = Alignment(horizontal="center")
    db.cell(row=r_, column=7).alignment = Alignment(horizontal="center")
db.cell(row=row + 2, column=2, value="* Column G starts as planned hours — overwrite it with your real logged hours per season.")
db.cell(row=row + 2, column=2).font = Font(name=FONT, size=9, italic=True, color="6A6480")

# goal card
g0 = row + 4
db.cell(row=g0, column=2, value="THE GOAL").font = Font(name=FONT, bold=True, size=12, color=MAGENTA)
goals = [
    ("Portfolio live", "Day 7"),
    ("3 JavaScript projects deployed", "Day 30"),
    ("React + TypeScript project live", "Day 60"),
    ("Authenticated REST API deployed", "Day 90"),
    ("Capstone shipped with Docker + CI", "Day 120"),
    ("100+ applications + 10 referrals", "Day 180"),
    ("Offer signed", "Day 210–240"),
]
rr = g0 + 1
for goal, when in goals:
    a = db.cell(row=rr, column=2, value="☐  " + goal)
    a.font = Font(name=FONT, size=10, bold=True, color=DEEP)
    b = db.cell(row=rr, column=3, value=when)
    b.font = Font(name=FONT, size=10, color="6A6480")
    rr += 1

# =====================================================================
# 3. STUDY TRACKER
# =====================================================================
st = wb.create_sheet("STUDY TRACKER")
st.sheet_properties.tabColor = PURPLE
title(st, "STUDY TRACKER", "One row per checkpoint. Status drives the dashboard. Planned hrs is a guide — log real hours in WEEKLY LOG.", width=11)
headers = ["Season", "#", "Topic / checkpoint", "Main resource (see RESOURCES tab)", "Planned hrs",
           "Start date", "Done date", "Status", "Confidence 1–5", "Revision date", "Notes / questions"]
hdr(st, 3, headers)
widths(st, {"A": 30, "B": 5, "C": 62, "D": 34, "E": 10, "F": 12, "G": 12, "H": 14, "I": 12, "J": 13, "K": 40})

r = 4
season_tint = ["FFF6F0", WHITE, "F7F4FF", "F1FBF8", "F0F9FE", "FEF3F7", "F8F3FE", "FBF7EA", "F2FAF4"]
for i, p in enumerate(D.PHASES, start=1):
    label = "%s %s %s" % (p["num"], p["emoji"], p["title"])
    n = len(p["checklist"])
    per = round(p["hours"] / n, 1)
    primary = p["watch"][0]
    for j, item in enumerate(p["checklist"], start=1):
        st.cell(row=r, column=1, value=label)
        st.cell(row=r, column=2, value=j)
        st.cell(row=r, column=3, value=item)
        if j == 1:
            c = st.cell(row=r, column=4, value="%s — %s" % (primary["c"], primary["t"]))
            c.hyperlink = primary["u"]
            c.font = Font(name=FONT, size=10, color="3A2E8C", underline="single")
        st.cell(row=r, column=5, value=per)
        st.cell(row=r, column=8, value="Not started")
        st.cell(row=r, column=9, value=0)
        for c_ in range(1, 12):
            st.cell(row=r, column=c_).fill = PatternFill("solid", fgColor=season_tint[(i - 1) % len(season_tint)])
        r += 1
last_row = r - 1
body_style(st, 4, last_row, 1, 11)
for rr_ in range(4, last_row + 1):
    st.cell(row=rr_, column=5).number_format = "0.0"
    st.cell(row=rr_, column=2).alignment = Alignment(horizontal="center")
    st.cell(row=rr_, column=9).alignment = Alignment(horizontal="center")
    for cc in (6, 7, 10):
        st.cell(row=rr_, column=cc).number_format = "dd-mmm-yy"

dv_status = DataValidation(type="list", formula1='"Not started,In progress,Done,Revise"', allow_blank=True,
                           showDropDown=False, prompt="Pick a status", promptTitle="Status")
st.add_data_validation(dv_status)
dv_status.add("H4:H%d" % last_row)

dv_conf = DataValidation(type="whole", operator="between", formula1="0", formula2="5", allow_blank=True,
                         showErrorMessage=True, errorTitle="Confidence", error="Use 0–5")
st.add_data_validation(dv_conf)
dv_conf.add("I4:I%d" % last_row)

st.conditional_formatting.add("H4:H%d" % last_row,
    CellIsRule(operator="equal", formula=['"Done"'], fill=PatternFill("solid", fgColor=GREEN_F), font=Font(name=FONT, size=10, color="1F6B3F", bold=True)))
st.conditional_formatting.add("H4:H%d" % last_row,
    CellIsRule(operator="equal", formula=['"In progress"'], fill=PatternFill("solid", fgColor=AMBER_F), font=Font(name=FONT, size=10, color="8A6100", bold=True)))
st.conditional_formatting.add("H4:H%d" % last_row,
    CellIsRule(operator="equal", formula=['"Revise"'], fill=PatternFill("solid", fgColor=PURPLE_F), font=Font(name=FONT, size=10, color="5B3BBF", bold=True)))
st.conditional_formatting.add("I4:I%d" % last_row,
    CellIsRule(operator="lessThanOrEqual", formula=["2"], fill=PatternFill("solid", fgColor=ROSE_F)))

st.freeze_panes = "C4"
st.auto_filter.ref = "A3:K%d" % last_row

# =====================================================================
# 4. WEEKLY LOG
# =====================================================================
wl = wb.create_sheet("WEEKLY LOG")
wl.sheet_properties.tabColor = TEAL
title(wl, "WEEKLY LOG", "32 weeks, pre-dated from Mon 19 Oct 2026. Fill this every Sunday — 10 minutes, honestly.", width=10)
hdr(wl, 3, ["Week", "Week of (Mon)", "Planned focus", "Target hrs", "Hours logged", "DSA problems",
            "Lessons / videos", "Biggest win", "Blocker & fix", "Energy 1–5"])
widths(wl, {"A": 7, "B": 15, "C": 34, "D": 10, "E": 12, "F": 12, "G": 13, "H": 34, "I": 34, "J": 10})

focus_map = {}
ranges = [("01", 1, 2), ("02", 3, 7), ("03", 8, 11), ("04", 12, 16), ("05", 17, 18),
          ("06", 19, 22), ("08", 23, 24), ("09", 25, 32)]
for num, a, b in ranges:
    ph = next(p for p in D.PHASES if p["num"] == num)
    for w in range(a, b + 1):
        focus_map[w] = "%s %s — %s" % (ph["num"], ph["emoji"], ph["title"])

start = dt.date(2026, 10, 19)
r = 4
for w in range(1, 33):
    d0 = start + dt.timedelta(days=7 * (w - 1))
    wl.cell(row=r, column=1, value=w)
    c = wl.cell(row=r, column=2, value=d0)
    c.number_format = "dd-mmm-yy"
    wl.cell(row=r, column=3, value=focus_map.get(w, ""))
    wl.cell(row=r, column=4, value=30)
    r += 1
last_wl = r - 1
body_style(wl, 4, last_wl, 1, 10)
for rr_ in range(4, last_wl + 1):
    for cc in (1, 4, 5, 6, 7, 10):
        wl.cell(row=rr_, column=cc).alignment = Alignment(horizontal="center")
# highlight seasons 5-6 lightly
for rr_ in range(4, last_wl + 1):
    wkn = wl.cell(row=rr_, column=1).value
    if 17 <= wkn <= 18:
        for cc in range(1, 11):
            wl.cell(row=rr_, column=cc).fill = PatternFill("solid", fgColor=BLUE_F)
    elif 23 <= wkn <= 24:
        for cc in range(1, 11):
            wl.cell(row=rr_, column=cc).fill = PatternFill("solid", fgColor="FBF4DE")
    elif 19 <= wkn <= 22:
        for cc in range(1, 11):
            wl.cell(row=rr_, column=cc).fill = PatternFill("solid", fgColor="FDECF2")
    elif 25 <= wkn <= 32:
        for cc in range(1, 11):
            wl.cell(row=rr_, column=cc).fill = PatternFill("solid", fgColor="EAF7EF")

sum_row = last_wl + 1
wl.cell(row=sum_row, column=1, value="Σ")
wl.cell(row=sum_row, column=3, value="Totals")
wl.cell(row=sum_row, column=4, value="=SUM(D4:D%d)" % last_wl)
wl.cell(row=sum_row, column=5, value="=SUM(E4:E%d)" % last_wl)
wl.cell(row=sum_row, column=6, value="=SUM(F4:F%d)" % last_wl)
wl.cell(row=sum_row, column=7, value="=SUM(G4:G%d)" % last_wl)
for cc in range(1, 11):
    cl = wl.cell(row=sum_row, column=cc)
    cl.font = Font(name=FONT, bold=True, size=10, color=DEEP)
    cl.fill = PatternFill("solid", fgColor=CREAM2)
    cl.border = BORDER

dv_energy = DataValidation(type="whole", operator="between", formula1="1", formula2="5", allow_blank=True)
wl.add_data_validation(dv_energy); dv_energy.add("J4:J%d" % last_wl)
wl.freeze_panes = "C4"
wl.auto_filter.ref = "A3:J%d" % last_wl

# =====================================================================
# 5. PROJECTS
# =====================================================================
pj = wb.create_sheet("PROJECTS")
pj.sheet_properties.tabColor = CORAL
title(pj, "PROJECTS — the boss ladder", "A project is only 'done' when it is deployed and the README has a live link. Milestones: 1 = not started, 2 = in progress, 3 = done.", width=9)
hdr(pj, 3, ["Project", "Stack", "Weeks", "Milestones to hit", "Live URL", "GitHub repo", "Demo video", "README done?", "Status"])
widths(pj, {"A": 30, "B": 34, "C": 12, "D": 60, "E": 26, "F": 26, "G": 20, "H": 13, "I": 13})

r = 4
for p in D.PROJECTS:
    ms = " • ".join(p["features"])
    pj.cell(row=r, column=1, value="%s %s" % (p["lv"], p["title"]))
    pj.cell(row=r, column=2, value=p["stack"])
    pj.cell(row=r, column=3, value=p["weeks"])
    pj.cell(row=r, column=4, value=ms)
    pj.cell(row=r, column=8, value="Not yet")
    pj.cell(row=r, column=9, value="Not started")
    r += 1
last_pj = r - 1
body_style(pj, 4, last_pj, 1, 9)
for rr_ in range(4, last_pj + 1):
    pj.row_dimensions[rr_].height = 46

dv_pj = DataValidation(type="list", formula1='"Not started,In progress,Deployed"', allow_blank=True, showDropDown=False)
pj.add_data_validation(dv_pj); dv_pj.add("I4:I%d" % last_pj)
dv_rd = DataValidation(type="list", formula1='"Not yet,Yes"', allow_blank=True, showDropDown=False)
pj.add_data_validation(dv_rd); dv_rd.add("H4:H%d" % last_pj)
pj.conditional_formatting.add("I4:I%d" % last_pj,
    CellIsRule(operator="equal", formula=['"Deployed"'], fill=PatternFill("solid", fgColor=GREEN_F), font=Font(name=FONT, bold=True, color="1F6B3F")))
pj.conditional_formatting.add("I4:I%d" % last_pj,
    CellIsRule(operator="equal", formula=['"In progress"'], fill=PatternFill("solid", fgColor=AMBER_F)))
pj.freeze_panes = "A4"

# =====================================================================
# 6. DSA LOG
# =====================================================================
ds = wb.create_sheet("DSA LOG")
ds.sheet_properties.tabColor = "9B51E0"
title(ds, "DSA LOG", "150 slots. 45 minutes a day from week 3. Patterns pre-filled; the first 30 rows have starter problems.", width=10)
hdr(ds, 3, ["#", "Pattern", "Problem", "Platform", "Difficulty", "Status", "Time (min)", "Date solved", "Re-solve date", "Notes / trick"])
widths(ds, {"A": 5, "B": 28, "C": 42, "D": 14, "E": 11, "F": 12, "G": 11, "H": 12, "I": 13, "J": 40})

patterns = [item for item in D.PHASES[6]["checklist"]]
patterns = [p for p in patterns if not p.startswith("150 total")]
starter = [
    ("Arrays & running sum", "Running Sum of 1d Array", "LeetCode", "Easy"),
    ("Arrays & running sum", "Best Time to Buy and Sell Stock", "LeetCode", "Easy"),
    ("Arrays & running sum", "Maximum Subarray", "LeetCode", "Medium"),
    ("Strings & frequency counting", "Valid Anagram", "LeetCode", "Easy"),
    ("Strings & frequency counting", "Valid Palindrome", "LeetCode", "Easy"),
    ("Hashing (maps/sets) patterns", "Two Sum", "LeetCode", "Easy"),
    ("Hashing (maps/sets) patterns", "Contains Duplicate", "LeetCode", "Easy"),
    ("Hashing (maps/sets) patterns", "Group Anagrams", "LeetCode", "Medium"),
    ("Hashing (maps/sets) patterns", "Top K Frequent Elements", "LeetCode", "Medium"),
    ("Two pointers", "Two Sum II – Input Array Is Sorted", "LeetCode", "Medium"),
    ("Two pointers", "3Sum", "LeetCode", "Medium"),
    ("Two pointers", "Container With Most Water", "LeetCode", "Medium"),
    ("Sliding window", "Maximum Average Subarray I", "LeetCode", "Easy"),
    ("Sliding window", "Longest Substring Without Repeating Characters", "LeetCode", "Medium"),
    ("Sliding window", "Longest Repeating Character Replacement", "LeetCode", "Medium"),
    ("Prefix sum", "Range Sum Query – Immutable", "LeetCode", "Easy"),
    ("Prefix sum", "Subarray Sum Equals K", "LeetCode", "Medium"),
    ("Stack (valid parentheses, next greater element)", "Valid Parentheses", "LeetCode", "Easy"),
    ("Stack (valid parentheses, next greater element)", "Min Stack", "LeetCode", "Medium"),
    ("Stack (valid parentheses, next greater element)", "Daily Temperatures", "LeetCode", "Medium"),
    ("Linked list (reverse, middle, cycle)", "Reverse Linked List", "LeetCode", "Easy"),
    ("Linked list (reverse, middle, cycle)", "Middle of the Linked List", "LeetCode", "Easy"),
    ("Linked list (reverse, middle, cycle)", "Linked List Cycle", "LeetCode", "Easy"),
    ("Binary search (and binary search on answer)", "Binary Search", "LeetCode", "Easy"),
    ("Binary search (and binary search on answer)", "Search a 2D Matrix", "LeetCode", "Medium"),
    ("Recursion & backtracking basics", "Subsets", "LeetCode", "Medium"),
    ("Trees: traversals, height, diameter", "Maximum Depth of Binary Tree", "LeetCode", "Easy"),
    ("Trees: traversals, height, diameter", "Invert Binary Tree", "LeetCode", "Easy"),
    ("Graphs: BFS, DFS, connected components", "Number of Islands", "LeetCode", "Medium"),
    ("Dynamic programming intro (climbing stairs, knapsack)", "Climbing Stairs", "LeetCode", "Easy"),
]

r = 4
for i in range(1, 151):
    ds.cell(row=r, column=1, value=i)
    if i <= len(starter):
        pat, prob, plat, diff = starter[i - 1]
        ds.cell(row=r, column=2, value=pat)
        ds.cell(row=r, column=3, value=prob)
        ds.cell(row=r, column=4, value=plat)
        ds.cell(row=r, column=5, value=diff)
    else:
        ds.cell(row=r, column=2, value=patterns[(i - len(starter) - 1) % len(patterns)])
    ds.cell(row=r, column=6, value="Not started")
    r += 1
last_ds = r - 1
body_style(ds, 4, last_ds, 1, 10)
for rr_ in range(4, last_ds + 1):
    ds.cell(row=rr_, column=1).alignment = Alignment(horizontal="center")
    for cc in (5, 6, 7):
        ds.cell(row=rr_, column=cc).alignment = Alignment(horizontal="center")
    for cc in (8, 9):
        ds.cell(row=rr_, column=cc).number_format = "dd-mmm-yy"

dv_pat = DataValidation(type="list", formula1="=LISTS!$A$2:$A$%d" % (len(_lp) + 1), allow_blank=True)
ds.add_data_validation(dv_pat); dv_pat.add("B4:B%d" % last_ds)
dv_diff = DataValidation(type="list", formula1='"Easy,Medium,Hard"', allow_blank=True)
ds.add_data_validation(dv_diff); dv_diff.add("E4:E%d" % last_ds)
dv_dstat = DataValidation(type="list", formula1='"Not started,Solved,Revisit"', allow_blank=True)
ds.add_data_validation(dv_dstat); dv_dstat.add("F4:F%d" % last_ds)
dv_plat = DataValidation(type="list", formula1="=LISTS!$B$2:$B$6", allow_blank=True)
ds.add_data_validation(dv_plat); dv_plat.add("D4:D%d" % last_ds)
ds.conditional_formatting.add("F4:F%d" % last_ds,
    CellIsRule(operator="equal", formula=['"Solved"'], fill=PatternFill("solid", fgColor=GREEN_F), font=Font(name=FONT, bold=True, color="1F6B3F")))
ds.conditional_formatting.add("F4:F%d" % last_ds,
    CellIsRule(operator="equal", formula=['"Revisit"'], fill=PatternFill("solid", fgColor=PURPLE_F)))
ds.freeze_panes = "C4"
ds.auto_filter.ref = "A3:J%d" % last_ds

# =====================================================================
# 7. JOB APPLICATIONS
# =====================================================================
ja = wb.create_sheet("JOB APPLICATIONS")
ja.sheet_properties.tabColor = MAGENTA
title(ja, "JOB APPLICATIONS", "Target: 25 per week from week 25. A follow-up after 5–7 days doubles your reply rate.", width=10)
hdr(ja, 3, ["Date", "Company", "Role", "Location", "Source", "Referral contact", "Status", "Next action", "Follow-up date", "Notes"])
widths(ja, {"A": 12, "B": 24, "C": 28, "D": 16, "E": 16, "F": 22, "G": 14, "H": 30, "I": 14, "J": 32})

examples = [
    (dt.date(2026, 10, 19), "Example — Infopark company", "Full Stack Developer (Fresher)", "Kochi", "Infopark board", "", "Applied", "Follow up in 6 days", dt.date(2026, 10, 26), "Delete these example rows before you start."),
]
r = 4
for row_vals in examples:
    for i, v in enumerate(row_vals, start=1):
        ja.cell(row=r, column=i, value=v)
    r += 1
for _ in range(199):
    ja.cell(row=r, column=7, value="Not applied")
    r += 1
last_ja = r - 1
body_style(ja, 4, last_ja, 1, 10)
for rr_ in range(4, last_ja + 1):
    for cc in (1, 9):
        ja.cell(row=rr_, column=cc).number_format = "dd-mmm-yy"
    ja.cell(row=rr_, column=7).alignment = Alignment(horizontal="center")

dv_js = DataValidation(type="list", formula1='"Not applied,Applied,Shortlisted,Interview,Offer,Rejected,Ghosted"', allow_blank=True)
ja.add_data_validation(dv_js); dv_js.add("G4:G%d" % last_ja)
dv_src = DataValidation(type="list", formula1='"Infopark board,Technopark,Naukri,LinkedIn,Referral,Instahyre,Cutshort,Foundit,Indeed,Internshala,Other"', allow_blank=True)
ja.add_data_validation(dv_src); dv_src.add("E4:E%d" % last_ja)

for word, colour, txt in [("Applied", AMBER_F, "8A6100"), ("Shortlisted", BLUE_F, "1E5A8A"),
                          ("Interview", PURPLE_F, "5B3BBF"), ("Offer", GREEN_F, "1F6B3F"),
                          ("Rejected", "F1F1F1", "6A6480"), ("Ghosted", "F1F1F1", "6A6480")]:
    ja.conditional_formatting.add("G4:G%d" % last_ja,
        CellIsRule(operator="equal", formula=['"%s"' % word], fill=PatternFill("solid", fgColor=colour),
                   font=Font(name=FONT, bold=True, color=txt)))
ja.freeze_panes = "B4"
ja.auto_filter.ref = "A3:J%d" % last_ja

# =====================================================================
# 8. INTERVIEW PREP
# =====================================================================
ip = wb.create_sheet("INTERVIEW PREP")
ip.sheet_properties.tabColor = "2D9CDB"
title(ip, "INTERVIEW PREP", "Answer out loud first, then write the short version here. Revise the low-confidence ones weekly.", width=7)
hdr(ip, 3, ["Topic", "#", "Question", "Your answer (short version)", "Example from your projects", "Confidence 1–5", "Last revised"])
widths(ip, {"A": 18, "B": 5, "C": 58, "D": 52, "E": 34, "F": 12, "G": 13})

r = 4
for topic, qs in D.INTERVIEW.items():
    for i, q in enumerate(qs, start=1):
        ip.cell(row=r, column=1, value=topic)
        ip.cell(row=r, column=2, value=i)
        ip.cell(row=r, column=3, value=q)
        ip.cell(row=r, column=6, value=0)
        r += 1
last_ip = r - 1
body_style(ip, 4, last_ip, 1, 7)
for rr_ in range(4, last_ip + 1):
    ip.row_dimensions[rr_].height = 30
    ip.cell(row=rr_, column=2).alignment = Alignment(horizontal="center")
    ip.cell(row=rr_, column=6).alignment = Alignment(horizontal="center")
    ip.cell(row=rr_, column=7).number_format = "dd-mmm-yy"
dv_ip = DataValidation(type="whole", operator="between", formula1="0", formula2="5", allow_blank=True)
ip.add_data_validation(dv_ip); dv_ip.add("F4:F%d" % last_ip)
ip.conditional_formatting.add("F4:F%d" % last_ip,
    CellIsRule(operator="lessThanOrEqual", formula=["2"], fill=PatternFill("solid", fgColor=ROSE_F)))
ip.conditional_formatting.add("F4:F%d" % last_ip,
    CellIsRule(operator="greaterThanOrEqual", formula=["4"], fill=PatternFill("solid", fgColor=GREEN_F)))
ip.freeze_panes = "C4"
ip.auto_filter.ref = "A3:G%d" % last_ip

# =====================================================================
# 9. RESOURCES
# =====================================================================
rs = wb.create_sheet("RESOURCES")
rs.sheet_properties.tabColor = TEAL
title(rs, "RESOURCES", "Every link verified when the roadmap was built (Oct 2026). If a video link dies, search the channel name.", width=5)
hdr(rs, 3, ["Season", "Type", "Resource", "Channel / site", "Link"])
widths(rs, {"A": 34, "B": 12, "C": 52, "D": 30, "E": 62})
r = 4
for p in D.PHASES:
    label = "%s %s %s" % (p["num"], p["emoji"], p["title"])
    for w in p["watch"]:
        rs.cell(row=r, column=1, value=label)
        rs.cell(row=r, column=2, value="Video/Docs")
        rs.cell(row=r, column=3, value=w["t"])
        rs.cell(row=r, column=4, value=w["c"])
        c = rs.cell(row=r, column=5, value=w["u"])
        c.hyperlink = w["u"]
        c.font = Font(name=FONT, size=10, color="1155CC", underline="single")
        r += 1
for name, url, note in D.JOB_SOURCES:
    rs.cell(row=r, column=1, value="Job hunt")
    rs.cell(row=r, column=2, value="Job board")
    rs.cell(row=r, column=3, value=name)
    rs.cell(row=r, column=4, value=note)
    c = rs.cell(row=r, column=5, value=url)
    c.hyperlink = url
    c.font = Font(name=FONT, size=10, color="1155CC", underline="single")
    r += 1
for name, typ, url, note in D.CHEATS:
    rs.cell(row=r, column=1, value="Cheat sheet")
    rs.cell(row=r, column=2, value=typ)
    rs.cell(row=r, column=3, value=name)
    rs.cell(row=r, column=4, value=note)
    c = rs.cell(row=r, column=5, value=url)
    c.hyperlink = url
    c.font = Font(name=FONT, size=10, color="1155CC", underline="single")
    r += 1
last_rs = r - 1
body_style(rs, 4, last_rs, 1, 5)
rs.freeze_panes = "A4"
rs.auto_filter.ref = "A3:E%d" % last_rs

# =====================================================================
# 10. CHEAT SHEET
# =====================================================================
cs = wb.create_sheet("CHEAT SHEET")
cs.sheet_properties.tabColor = PURPLE
cs.sheet_view.showGridLines = False
title(cs, "CHEAT SHEET", "Print this tab (Ctrl+P) and stick it next to your monitor.", width=6)

row = 4
def block(title_, pairs, key_label, val_label, row, key_width_style="code"):
    cs.cell(row=row, column=2, value=title_).font = Font(name=FONT, bold=True, size=13, color=CORAL)
    row += 1
    hdr(cs, row, ["", key_label, val_label], height=22)
    row += 1
    for k, v in pairs:
        a = cs.cell(row=row, column=2, value=k)
        a.font = Font(name="Consolas", size=10, bold=True, color="0B6B5C" if key_width_style == "code" else DEEP)
        a.fill = PatternFill("solid", fgColor="EAF7F3" if key_width_style == "code" else "F2EEFF")
        a.border = BORDER
        b = cs.cell(row=row, column=3, value=v)
        b.font = Font(name=FONT, size=10, color="2E2942")
        b.border = BORDER
        b.alignment = Alignment(wrap_text=True, vertical="center")
        row += 1
    return row + 1

widths(cs, {"A": 3, "B": 42, "C": 72})
row = block("GIT — daily commands", D.GITCMDS, "Command", "What it does", row)
row = block("VS CODE — 15 shortcuts", D.VSCODE, "Shortcut", "Action", row, key_width_style="key")
row = block("JAVASCRIPT — array & object methods", D.JSMETHODS, "Method", "What it does", row)

cs.cell(row=row, column=2, value="POWER-UPS — PDF cheat sheets").font = Font(name=FONT, bold=True, size=13, color=CORAL)
row += 1
for name, typ, url, note in D.CHEATS:
    if typ != "PDF":
        continue
    c = cs.cell(row=row, column=2, value=name)
    c.hyperlink = url
    c.font = Font(name=FONT, size=10, color="1155CC", underline="single")
    d = cs.cell(row=row, column=3, value=url)
    d.font = Font(name="Consolas", size=9, color="6A6480")
    row += 1

# =====================================================================
# 11. SKILLS
# =====================================================================
sk = wb.create_sheet("SKILLS")
sk.sheet_properties.tabColor = "B98A00"
title(sk, "SKILLS MATRIX", "Rate yourself 1–5 now and set a target. Evidence = the project or link that proves it.", width=7)
hdr(sk, 3, ["Skill / tool", "Why it matters", "Priority", "Now 1–5", "Target 1–5", "Evidence (project / link)", "Notes"])
widths(sk, {"A": 30, "B": 52, "C": 10, "D": 10, "E": 10, "F": 32, "G": 28})
r = 4
for name, why, pri, when in D.TOOLS:
    sk.cell(row=r, column=1, value=name)
    sk.cell(row=r, column=2, value=why)
    sk.cell(row=r, column=3, value=pri)
    sk.cell(row=r, column=4, value=1)
    sk.cell(row=r, column=5, value=4)
    sk.cell(row=r, column=7, value="Planned: " + when)
    r += 1
last_sk = r - 1
body_style(sk, 4, last_sk, 1, 7)
dv_pri = DataValidation(type="list", formula1='"MUST,SHOULD,BONUS,LATER"', allow_blank=True)
sk.add_data_validation(dv_pri); dv_pri.add("C4:C%d" % last_sk)
dv_rate = DataValidation(type="whole", operator="between", formula1="1", formula2="5", allow_blank=True)
sk.add_data_validation(dv_rate); dv_rate.add("D4:E%d" % last_sk)
sk.conditional_formatting.add("C4:C%d" % last_sk,
    CellIsRule(operator="equal", formula=['"MUST"'], fill=PatternFill("solid", fgColor=ROSE_F), font=Font(name=FONT, bold=True, color="B3401D")))
sk.conditional_formatting.add("C4:C%d" % last_sk,
    CellIsRule(operator="equal", formula=['"SHOULD"'], fill=PatternFill("solid", fgColor="E8F6F2")))
sk.conditional_formatting.add("C4:C%d" % last_sk,
    CellIsRule(operator="equal", formula=['"BONUS"'], fill=PatternFill("solid", fgColor=PURPLE_F)))
sk.conditional_formatting.add("C4:C%d" % last_sk,
    CellIsRule(operator="equal", formula=['"LATER"'], fill=PatternFill("solid", fgColor="F1F1F1")))
for rr_ in range(4, last_sk + 1):
    for cc in (3, 4, 5):
        sk.cell(row=rr_, column=cc).alignment = Alignment(horizontal="center")
sk.freeze_panes = "A4"

# ---------- print setup ----------
for sheet in wb.worksheets:
    sheet.sheet_view.zoomScale = 90
    sheet.page_setup.orientation = "landscape"
    sheet.page_setup.fitToWidth = 1
    sheet.sheet_properties.pageSetUpPr.fitToPage = True
    sheet.print_options.horizontalCentered = True

wb.properties.title = "Operation Full Stack — Kerala Edition"
wb.properties.creator = "Arena Agent"
wb.properties.description = "32-week full-stack study tracker for the Kerala / South India job market"

wb._sheets = [wb["START HERE"], wb["DASHBOARD"], wb["STUDY TRACKER"], wb["WEEKLY LOG"], wb["PROJECTS"],
              wb["DSA LOG"], wb["JOB APPLICATIONS"], wb["INTERVIEW PREP"], wb["RESOURCES"],
              wb["CHEAT SHEET"], wb["SKILLS"], wb["LISTS"]]
wb.active = 0
wb.save("Full-Stack-Study-Tracker.xlsx")
print("saved workbook with sheets:", wb.sheetnames)
