from Approximation.Instruments.Functors.BaseFunctor import BaseFunctor_
import math

class Log2(BaseFunctor_):
    def __init__(self, internalFunctor):
        self.internalFunctor_ = internalFunctor;
        
    def GetConformity(self):
        return self.internalFunctor_.GetConformity();

    def __call__(self, data : list):
        result = self.internalFunctor_(data);
        return math.log2(result);

    def __str__(self):
        return self.ToString(bLatex=False);
    
    def ToString(self, bLatex=False):
        string = "log2";
        string += "(" + self.internalFunctor_.ToString(bLatex) + ")";
        return string;
    
    def __eq__(self, other): 
        return type(other) is Log2 and internalFunctor_ == other.internalFunctor_;