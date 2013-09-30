/*
        算法：       A*
        是否最优解： 是
        启发函数：   每一个数字位与目标中该数字位的距离，满足单调限制条件； 启发函数：   不在位的数字数
        说明：       A*算法是启发式搜索算法，搜索时充分利用当前状态距目标距离远近的启发信息，
        选取当前未扩展结点中估价函数最小的进行扩展，生成结点数少，搜索空间较小，实现稍复杂，
        备注：       程序未对输入数据进行检查
*/
#pragma warning(disable:4786)
#include <algorithm>
#include <cstdio>
#include <set>
#include <utility>
#include <ctime>
#include <cassert>
#include <cstring>
using namespace std;

/*
        item记录搜索空间中一个结点
        state 记录用整数形式表示的8数码格局
        blank 记录当前空格位置，主要用于程序优化，扩展时可不必在寻找空格位置
        g, h  对应g(n), h(n)
        pre   记录当前结点由哪个结点扩展而来
*/
struct item 
{
        int state; 
        int blank;
        int g;
        int h;
        int pre;
};

const int MAXSTEPS = 100000;
const int MAXCHAR = 100;
char buf[MAXCHAR][MAXCHAR];
//open表
item open[MAXSTEPS];
int steps = 0;
//closed表，已查询状态只要知道该状态以及它由哪个结点扩展而来即可，用于输出路径
//每次只需得到对应f值最小的待扩展结点，用堆实现提高效率
pair<int, int> closed[MAXSTEPS];

//读入，将8数码矩阵格局转换为整数表示
bool read(pair<int,int> &state)
{
        if (!gets(buf[0]))
                return false;
        if (!gets(buf[1]))
                return false;
        if (!gets(buf[2]))
                return false;
        assert(strlen(buf[0]) == 5 && strlen(buf[1]) == 5 && strlen(buf[2]) == 5);
        state.first = 0;
        for (int i = 0, p = 1; i < 3; ++i)
        {
                for (int j = 0; j < 6; j += 2)
                {
                        if (buf[i][j] == ' ')
                                state.second = i * 3 + j / 2;
                        else
                                state.first += p * (buf[i][j] - '0');
                        p *= 10;
                }
        }
        return true;
}

 

/*
int calculate(int current, int target)
{
        int cnt = 0;
        for (int i = 0; i < 9; ++i)
        {
                if ((current % 10 != 0)&& (current % 10) != (target % 10))
                        ++cnt;
                current /= 10;
                target  /= 10;
        }
        return cnt;
}
*/

//计算当前结点距目标的距离
int calculate(int current, int target)
{
        int c[9], t[9];
        int i, cnt = 0;
        for (i = 0; i < 9; ++i)
        {
                c[current % 10] = t[target  % 10] = i;
                current /= 10;
                target  /= 10;
        }
        for (i = 1; i < 9; ++i)
                cnt += abs(c[i] / 3 - t[i] / 3) + abs(c[i] % 3 - t[i] % 3);
        return cnt;
}

//open表中结点间选择时的规则 f(n) = g(n) + h(n)
class cmp
{
public: inline bool operator()(item a, item b)
        {
                return a.g + a.h > b.g + b.h;
        }
};

//将整数形式表示转换为矩阵表示输出
void pr(int state)
{
        memset(buf, ' ', sizeof(buf));
        for (int i = 0; i < 3; ++i)
        {
                for (int j = 0; j < 6; j += 2)
                {
                        if (state % 10)
                                buf[i][j] = state % 10 + '0';
                        state /= 10;
                }
                buf[i][5] = '/0';
                puts(buf[i]);
        }
}

//用于判断当前空格是否可以向对应方向移动
inline bool suit(int a, int b)
{
        return (a >= 0 && a < 3 && b >= 0 && b < 3);
}

//递归输出搜索路径路径
void path(int index)
{
        if (index == 0)
        {
                pr(closed[index].first);
                puts("");
                return;
        }
        path(closed[index].second);
        pr(closed[index].first);
        puts("");
        ++steps;
}

int main()
{
        unsigned int t1 = clock();
        freopen("astar.in", "r", stdin);
        freopen("astar2.out", "w", stdout);
        set<int>states;
        char tmp[100];
        int i, x, y, a, b, nx, ny, end, next, index, kase = 0;
        pair<int,int> start, target;
        item head;
        //4个方向移动时的偏移量
        const int xtran[4] = {-1, 0, 1, 0};
        const int ytran[4] = {0, 1, 0, -1};
        const int p[] = {1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000};
        
        while (read(start))
        {
                unsigned int t2 = clock();
                printf("Case %d:/n/n", ++kase);
                gets(tmp);
                read(target);
                gets(tmp);
                
                //初始化open表，将初始状态加入
                open[0].state = start.first;
                open[0].h     = calculate(start.first, target.first);
                open[0].blank = start.second;
                open[0].pre   = -1;
                open[0].g     = 0;
                index = 0;
                states.insert(start.first);
                
                //提取open表中f值最小元素放入closed表，并对该结点进行扩展
                for (end = 1; end > 0; ++index)
                {
                        assert(index < MAXSTEPS);
                        //临时存储
                        head = open[0];
                        //放入closed表记录当前格局和由哪个结点扩展而来（该结点肯定已在closed表中）
                        closed[index].first  = open[0].state;
                        closed[index].second = open[0].pre;
                        
                        //从open表中删除该结点
                        pop_heap(open, open + end, cmp());
                        --end;
                        //得到结果，递归输出路径
                        if (head.state == target.first)
                        {
                                path(index);
                                break;
                        }
                        x = head.blank / 3;
                        y = head.blank % 3;
                        for (i = 0; i < 4; ++i)
                        {
                                nx = x + xtran[i];
                                ny = y + ytran[i];
                                if (suit(nx, ny))
                                {
                                        a = head.blank;
                                        b = nx * 3 + ny;
                                        //调换十进制表示整数对应两个数字位
                                        next = head.state + ((head.state % p[a + 1]) / p[a] - (head.state % p[b + 1]) / p[b]) * p[b]
                                                + ((head.state % p[b + 1]) / p[b] - (head.state % p[a + 1]) / p[a]) * p[a];
                                        //判断是否已经扩展过
                                        if (states.find(next) == states.end())
                                        {
                                                states.insert(next);
                                                open[end].pre   = index;
                                                open[end].blank = b;
                                                open[end].state = next;
                                                open[end].h     = calculate(next, target.first);
                                                open[end].g     = head.g + 1;
                                                ++end;
                                                push_heap(open, open + end, cmp());
                                        }
                                }
                        }
                }
                if (end <= 0)
                        puts("No solution");
                else
                {
                        printf("Num of steps: %d/n", steps);
                        printf("Num of expanded: %d/n", index);
                        printf("Num of generated: %d/n", index + end);
                        printf("Time consumed: %d/n/n", clock() - t2);
                }
                
                states.clear();
                steps = 0;
        }
        printf("Total time consumed: %d/n", clock() - t1);
        return 0;
}